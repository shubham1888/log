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

const search = (a) => {
    if (jsondata.length > 0) {
        let arr = new Array();
        let result = []
        jsondata.map((i) => {
            let temparr = i.query;
            for (let j = 0; j < a.length; j++) {
                for (let k = 0; k < temparr.length; k++) {
                    if ((a[j] === i.query[k]) || (a[j] === i.query[k].substring(0, a[j].length)) || (a[j] === (i.query[k].substring(i.query[k].indexOf(a[j]), i.query[k].length)))) {
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
