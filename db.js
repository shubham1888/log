#!/usr/bin/env node
const fs = require("node:fs")
const config = require("./config.json")
const axios = require("axios")

let jsondata = []
let datalocation = `./${config.fileinfo.database_folder}/${config.fileinfo.database_file}.${config.fileinfo.database_file_extension}`
const check = () => {
    if (fs.existsSync(`./${config.fileinfo.database_folder}`)) {
        try {
            let data = require(datalocation)
            jsondata = data
            // console.log(data);
        } catch (e) {
            // console.log(e);
            jsondata = []
            console.log("Data not found!");
        }
    } else {
        fs.mkdir(`${config.fileinfo.database_folder}`, { recursive: true }, (e, d) => {
            if (e) throw e;
            console.log(`Database created`)
        })
        fs.writeFileSync(`${config.fileinfo.database_folder}/${config.fileinfo.database_file}.${config.fileinfo.database_file_extension}`, "")
    }
    // if (jsondata.length > 0) {
    //     // some code
    // } else {
    //     console.log("Data not found")
    //     process.exit(1)
    // }
}
check()

const set = (data) => {
    jsondata.push(data);
    fs.writeFileSync(datalocation, JSON.stringify(jsondata))
    return data.id
}

const get = (obj) => {
    // console.log(obj)
    if (jsondata.length > 0) {
        if ((obj.else === "")) {
            return jsondata;
        } else {
            let returnval = []
            if (obj.id) {
                jsondata.map((i) => {
                    if (i.id === obj.id) {
                        // console.log(i)
                        returnval.push(i)
                    }
                })
            }
            if (obj.day) {
                jsondata.map((i) => {
                    if (i.date.day === obj.day) {
                        // console.log(i)
                        returnval.push(i)
                    }
                })
            }
            if (obj.year) {
                jsondata.map((i) => {
                    if (i.date.year == obj.year) {
                        // console.log(i)
                        returnval.push(i)
                    }
                })
            }
            if (obj.date) {
                jsondata.map((i) => {
                    if (i.date.date == obj.date) {
                        // console.log(i)
                        returnval.push(i)
                    }
                })
            }
            if (obj.month) {
                jsondata.map((i) => {
                    if (i.date.month == obj.month) {
                        // console.log(i)
                        returnval.push(i)
                    }
                })
            }
            if (obj.time) {
                jsondata.map((i) => {
                    if (obj.time.length > 2) {
                        if ((i.date.time === obj.time)) {
                            // console.log(i)
                            returnval.push(i)
                        }
                    } else if (obj.time.length === 1) {
                        if ((i.date.time.substring(0, 2) === obj.time + ":")) {
                            // console.log(i)
                            returnval.push(i)
                        }
                    } else if (obj.time.length === 2) {
                        if ((i.date.time.substring(0, 2) === obj.time)) {
                            // console.log(i)
                            returnval.push(i)
                        }
                    } else {

                    }
                })
            }
            return returnval;
        }
    } else {
        console.log("Data not found")
    }
}

const del = (id) => {
    let arr = [];
    let delID = ""
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id === id) {
                i.deleted = true;
                delID = i.id;
            }
        })
        fs.writeFileSync(datalocation, JSON.stringify(jsondata))
        return delID;
    } else {
        console.log("Data not found")
    }
}

const search = (query) => {
    if (jsondata.length > 0) {
        let result = []
        jsondata.map((i) => {
            const titlequery = i.title.toUpperCase().split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
            const bodyquery = i.body.toUpperCase().split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
            let category = i.category.map(str => str.toUpperCase());
            query = query.map(str => str.toUpperCase());
            for (let j = 0; j < query.length; j++) {
                for (let k = 0; k < titlequery.length; k++) {
                    if ((query[j] === titlequery[k]) || (query[j] === titlequery[k].substring(0, query[j].length)) || (query[j] === (titlequery[k].substring(titlequery[k].indexOf(query[j]), (titlequery[k].length - query[j].length) + 1)))) {
                        if (!(i.deleted)) {
                            result.push(i)
                        }
                    }
                }
            }
            for (let j = 0; j < query.length; j++) {
                for (let k = 0; k < bodyquery.length; k++) {
                    if ((query[j] === bodyquery[k]) || (query[j] === bodyquery[k].substring(0, query[j].length)) || (query[j] === (bodyquery[k].substring(bodyquery[k].indexOf(query[j]), (bodyquery[k].length - query[j].length) + 1)))) {
                        if (!(i.deleted)) {
                            result.push(i)
                        }
                    }
                }
            }
            for (let j = 0; j < query.length; j++) {
                for (let k = 0; k < category.length; k++) {
                    if ((query[j] === category[k]) || (query[j] === category[k].substring(0, query[j].length)) || (query[j] === (category[k].substring(category[k].indexOf(query[j]), (category[k].length - query[j].length) + 1)))) {
                        if (!(i.deleted)) {
                            result.push(i)
                        }
                    }
                }
            }
        })
        let qdata = [...new Set(result)]
        return qdata
    } else {
        return []
    }
}

const update = (id, { log, pass, fav, deleted, query }) => {
    // console.log(id, log, pass, fav, deleted, query)
    let returnarr = []
    let updatereturnid;
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id === id) {
                let passlength;
                updatereturnid = i.id
                try {
                    passlength = pass.length
                } catch (err) {
                    passlength = 0
                }
                if (pass === null || passlength) {
                    i.pass = pass
                    returnarr.push(`Updated ID:${i.id} Pass ${i.pass} -> ${pass}`)
                }
                if (deleted === true) {
                    i.deleted = deleted
                    returnarr.push(`Updated ID:${i.id} Deleted ${i.deleted} -> ${deleted}`)
                }
                if (deleted === false) {
                    i.deleted = deleted
                    returnarr.push(`Updated ID:${i.id} Deleted ${i.deleted} -> ${deleted}`)
                }
                if (fav === true) {
                    i.fav = fav
                    returnarr.push(`Updated ID:${i.id} Fav ${i.fav} -> ${fav}`)
                }
                if (fav === false) {
                    i.fav = fav
                    returnarr.push(`Updated ID:${i.id} Fav ${i.fav} -> ${fav}`)
                }
                if (log) {
                    i.log = log
                    returnarr.push(`Updated ID:${i.id} log ${i.log} -> ${log}`)
                }
                if (query) {
                    i.query = query
                    returnarr.push(`Updated ID:${i.id} query ${i.query} -> ${query}`)
                }
            }
        })
        returnarr.push(updatereturnid)
        return returnarr;
    } else {
        return []
    }
}

const list = () => {
    let arr = []
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (!(i.deleted)) {
                arr.push(i.id)
            }
        })
        return arr;
    } else {
        return []
    }
}

const append = ({ appendid, appendlogval, query }) => {
    let id = ''
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id == appendid) {
                i.log += appendlogval
                query.map((j) => {
                    i.query.push(j)
                })
                id = i.id
                fs.writeFileSync(datalocation, JSON.stringify(jsondata))
            }
        })
        return id;
    } else {
        return []
    }
}

const exportlogs = async () => {
    if (jsondata.length > 0) {
        let res;
        res = jsondata.map(async (i) => {
            await fetch("https://server.shubham1888.repl.co/setlogs", {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(jsondata)
            })
            // .then(res => {
            //     return { res: res }
            // });
        })
        return { msg: 'Logs migrated successfully' }
    } else {
        return []
    }
}
const importlogs = (url) => {
    try {
        return axios.get(url).then((response) => response);
    } catch (e) {
        console.error(e)
    }
}
const getreq = (url) => {
    return axios.get(url).then((response) => response);
}
const postreq = (url, data) => {
    if (typeof (data) === "object") {
        data = JSON.stringify(data)
    }
    return axios.post(url, data).then((response) => response);
}

module.exports = {
    set,
    get,
    del,
    search,
    update,
    list,
    append,
    exportlogs,
    importlogs,
    getreq,
    postreq,
}
