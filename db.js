#!/usr/bin/env node
const fs = require("node:fs")
const path = require('path');
let config
try {
    config = require("./config.json")
} catch (err) {
    config = {}
}


function timeSince(date) {
    date = new Date(Date.now() - date);
    var seconds = Math.floor((new Date() - date) / 1000);

    var interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes";
    }
    return Math.floor(seconds) + " seconds";
}


let jsondata = []
let datalocation = `./${config.fileinfo.database_folder}/${config.fileinfo.database_file}.${config.fileinfo.database_file_extension}`
let foldername = config.fileinfo.database_folder
const check = () => {
    if (fs.existsSync(`./${foldername}`)) {
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
        fs.mkdir(`${foldername}`, { recursive: true }, (e, d) => {
            if (e) throw e;
            console.log(`Database created`)
        })
        fs.writeFileSync(datalocation, "")
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

const get = (query) => {
    // console.log(obj)
    if (jsondata.length > 0) {
        if (query === "") {
            return jsondata;
        } else {
            if (query === "today") {
                console.log(jsondata.map(i => timeSince(new Date(Date.now() - parseInt(i.id, 36)))))
            }
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
                        result.push(i)
                    }
                }
            }
            for (let j = 0; j < query.length; j++) {
                for (let k = 0; k < bodyquery.length; k++) {
                    if ((query[j] === bodyquery[k]) || (query[j] === bodyquery[k].substring(0, query[j].length)) || (query[j] === (bodyquery[k].substring(bodyquery[k].indexOf(query[j]), (bodyquery[k].length - query[j].length) + 1)))) {
                        result.push(i)
                    }
                }
            }
            for (let j = 0; j < query.length; j++) {
                for (let k = 0; k < category.length; k++) {
                    if ((query[j] === category[k]) || (query[j] === category[k].substring(0, query[j].length)) || (query[j] === (category[k].substring(category[k].indexOf(query[j]), (category[k].length - query[j].length) + 1)))) {
                        result.push(i)
                    }
                }
            }
            if (i.id.toUpperCase() === query) {
                result.push(i)
            }
        })
        let qdata = [...new Set(result)]
        return qdata
    } else {
        return []
    }
}

const update = (uid, utitle, ubody, ucatarr) => {
    // console.log(id, log, pass, fav, deleted, query)
    let returnarr = []
    let updatereturnid;
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id === uid) {
                updatereturnid = i.id
                if (utitle) {
                    i.title = utitle
                    // returnarr.push(`Updated ID:${i.id} log ${i.title} -> ${utitle}`)
                }
                if (ubody) {
                    i.body = ubody
                    // returnarr.push(`Updated ID:${i.id} query ${i.body} -> ${ubody}`)
                }
                if (ucatarr) {
                    i.category = ucatarr
                    // returnarr.push(`Updated ID:${i.id} query ${i.category} -> ${ucatarr}`)
                }
            }
        })
        fs.writeFileSync(datalocation, JSON.stringify(jsondata))
        return updatereturnid;
    } else {
        return []
    }
}

const list = () => {
    let arr = []
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            arr.push(i.id)
        })
        return arr;
    } else {
        return []
    }
}

const append = ({ appendid, appendtitle, appendbody, appendcategory }) => {
    let id = ''
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id == appendid) {
                i.title += appendtitle
                i.body += appendbody
                appendcategory.map((j) => {
                    i.category.push(j)
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

const mkhide = (id) => {
    let returnid = ""
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id === id) {
                i.hidden = true;
                returnid = i.id;
            }
        })
        fs.writeFileSync(datalocation, JSON.stringify(jsondata))
        return returnid;
    } else {
        console.log("Data not found")
    }
}

const unhide = (id) => {
    let returnid = ""
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id === id) {
                i.hidden = false;
                returnid = i.id;
            }
        })
        fs.writeFileSync(datalocation, JSON.stringify(jsondata))
        return returnid;
    } else {
        console.log("Data not found")
    }
}

const mkfav = (id) => {
    let returnid = ""
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id === id) {
                i.fav = true;
                returnid = i.id;
            }
        })
        fs.writeFileSync(datalocation, JSON.stringify(jsondata))
        return returnid;
    } else {
        console.log("Data not found")
    }
}

const rmfav = (id) => {
    let returnid = ""
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id === id) {
                i.fav = false;
                returnid = i.id;
            }
        })
        fs.writeFileSync(datalocation, JSON.stringify(jsondata))
        return returnid;
    } else {
        console.log("Data not found")
    }
}

const restore = (id) => {
    let returnid = ""
    if (jsondata.length > 0) {
        jsondata.map((i) => {
            if (i.id === id) {
                i.deleted = false;
                returnid = i.id;
            }
        })
        fs.writeFileSync(datalocation, JSON.stringify(jsondata))
        return returnid;
    } else {
        console.log("Data not found")
    }
}

// const migrate = () => {
//     if (jsondata.length > 0) {
//         writeFile()
//     } else {
//         console.log("Data not found")
//     }
// }
const backup = () => {
    if (jsondata.length > 0) {
        // fs.createReadStream(datalocation).pipe(fs.createWriteStream(`./${foldername}/backup.json`));
        const sourceFilePath = 'data/data.json';
        const backupFolderPath = 'backup';
        const backupFilePath = 'backup/backup.json';
        if (!fs.existsSync(backupFolderPath)) {
            fs.mkdirSync(backupFolderPath);
        }
        fs.copyFileSync(sourceFilePath, backupFilePath);
        return "Backup successful"
    } else {
        console.log("Data not found")
    }
}

module.exports = {
    set,
    get,
    del,
    search,
    update,
    list,
    append,
    mkhide,
    unhide,
    mkfav,
    rmfav,
    restore,
    backup,
}
