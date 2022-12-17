#!/usr/bin/env node
const fs = require("node:fs")
const config = require("./config")

let jsondata = []
let datalocation = ``
try {
    // console.log(`./${config.dataFolder}/${config.dataFile}.${config.dateFileExtension}`)
    datalocation = `./${config.dataFolder}/${config.dataFile}.${config.dateFileExtension}`
    jsondata = require(datalocation)
    // console.log(jsondata.length)
    // console.log(jsondata)
} catch (e) {
    // console.log(jsondata.length)
    // console.log(jsondata)
    console.log("Data not found!");
}

const set = (data) => {
    if (fs.existsSync(`./${config.dataFolder}`)) {
        jsondata.push(data);
        fs.writeFileSync(datalocation, JSON.stringify(jsondata))
        return data.id
    } else {
        fs.mkdir(`${config.dataFolder}`, { recursive: true }, (e, d) => {
            if (e) throw e;
            console.log(`Using this db first time!`)
        })
        fs.writeFileSync(datalocation, `[${JSON.stringify(data)}]`)
        return data.id;
    }
}

const get = () => {
    if (fs.existsSync(`./${config.dataFolder}`)) {
        if (jsondata.length > 0) {
            return jsondata;
        } else {
            console.log("Data not found")
        }
    } else {
        console.log("Data folder not found!")
    }
}

const del = (id) => {
    if (fs.existsSync(`./${config.dataFolder}`)) {
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
    } else {
        console.log("Data folder not found!")
    }
}

const search = (a) => {
    if (fs.existsSync(`./${config.dataFolder}`)) {
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
    } else {
        console.log("Log folder not found!")
    }
}

const update = (id, { log, pass, fav, deleted, query }) => {
    // console.log(id, log, pass, fav, deleted, query)
    if (fs.existsSync(`./${config.dataFolder}`)) {
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
    } else {
        console.log("Data folder not found!")
    }
}

const list = () => {
    if (fs.existsSync(`./${config.dataFolder}`)) {
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
    } else {
        console.log("Data folder not found!")
    }
}

module.exports = {
    set,
    get,
    del,
    search,
    update,
    list,
}
