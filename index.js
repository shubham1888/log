#!/usr/bin/env node
const db = require("./db");
const os = require("node:os")
const fs = require("node:fs")
const colors = require('ansi-colors');
const CryptoJS = require("crypto-js");
const config = require("./config");
// console.clear()

// const argv = process.argv.slice(2);
const argv = process.argv;
let input = ""
for (let i = 3; i < argv.length; i++) {
    command = argv[i];
    input = input + command + " ";
}
input = input.substring(0, input.length - 1)
let query = input.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
// console.log(query)
// console.log(query.length)
// console.log(input.length)
// // console.log(argv)
// console.log(argv[3])
// console.log(argv[3].length)
// console.log(input)

// const check = () => {
//     let data = db.initialise()
//     console.log(data)
//     // let inputdata = {}
//     let inputdata = []
//     if (data.username === null) {
//         inputdata.username = require('prompt-sync')()('[Username] # ')
//     }
//     if (data.password === null) {
//         inputdata.password = require('prompt-sync')()('[Password] # ')
//     }
//     fs.writeFileSync("./config.js", )
//     // process.exit(1)
// }
// check()

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

if (argv[2] === "log" || argv[2] === "l") {
    let inputdata = require('prompt-sync')()('[Log] # ')
    // inputdata = CryptoJS.AES.encrypt(inputdata, `${config.crypto_secret_key}`).toString()
    let pass = require('prompt-sync')().hide('[Pass] # (Null) ')
    let query = inputdata.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    if (pass === "n" || pass === "N" || pass === "null" || pass === "" || pass === "Null") {
        pass = null;
    }
    if (pass !== null) {
        pass = CryptoJS.AES.encrypt(pass, `${config.crypto_secret_key}`).toString()
    }
    let d = new Date()
    const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    let data = {
        id: Date.now().toString(36),
        log: inputdata,
        useuname: config.userinfo.username,
        pass: pass,
        fav: false,
        deleted: false,
        query,
        lastupdated: null,
        date: {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            date: d.getDate(),
            day: day[d.getDay()],
            hour: d.getHours(),
            minutes: d.getMinutes(),
            seconds: d.getSeconds(),
            time: d.toLocaleTimeString(),
            now: Date.now(),
        },
        ldate: d.toString(),
        utc: d.toUTCString(),
        permissions: {
            read: true,
            update: true,
            del: true,
            mkfav: true,
            setpass: true
        },
        info: {
            platform: os.platform(),
            hostname: os.hostname(),
            totalmem: os.totalmem(),
        },
    }
    const res = db.set(data)
    console.log(res)
} else if (argv[2] === "g") {
    console.log(colors.red("Find values [id] [year] [month] [date] [day] [time] "))
    let findvalue = require('prompt-sync')()(colors.green('[Find value] # '))
    let inputdata = ""
    if (!(findvalue === '')) {
        inputdata = require('prompt-sync')()(colors.green('[Data] # '))
    }
    let obj = {}
    if (findvalue === "") {
        obj.else = ""
    }
    if (findvalue === "id") {
        obj.id = inputdata
    }
    if (findvalue === "date") {
        obj.date = inputdata
    }
    if (findvalue === "day") {
        obj.day = inputdata
    }
    if (findvalue === "year") {
        obj.year = inputdata
    }
    if (findvalue === "month") {
        obj.month = inputdata
    }
    if (findvalue === "time") {
        obj.time = inputdata
    }
    let data = db.get(obj)
    // console.log(data)
    if (data) {
        data.map((i) => {
            if (!i.deleted) {
                console.log(colors.yellow(`[Log] # ${i.log}`))
                console.log(colors.green(`[ID] # ${i.id}`))
                console.log(colors.cyan(`[Date] # ${i.date.year}-${i.date.month}-${i.date.date} [${timeSince(new Date(Date.now() - i.date.now))}] [${i.date.time}] [${i.date.day}]`))
                console.log(colors.red("----------------------------------------------------------"))
            }
        })
    } else {
        console.log([])
    }
} else if (argv[2] === "del" || argv[2] === "d") {
    let data = db.del(argv[3])
    console.log(data)
} else if (argv[2] === "search" || argv[2] === "s") {
    let inputdata = require('prompt-sync')()('[keyWords] # ')
    let query = inputdata.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    let data = db.search(query)
    if (data) {
        data.map((i) => {
            if (!i.deleted) {
                console.log(colors.yellow(`[Log] # ${i.log}`))
                console.log(colors.green(`[ID] # ${i.id}`))
                console.log(colors.cyan(`[Date] # ${i.date.year}-${i.date.month}-${i.date.date} [${timeSince(new Date(Date.now() - i.date.now))}] [${i.date.time}] [${i.date.day}]`))
                console.log(colors.red("----------------------------------------------------------"))
            }
        })
    } else {
        console.log([])
    }
} else if (argv[2] === "list") {
    let data = db.list()
    console.log(data)
} else if (argv[2] === "u" || argv[2] === "update") {
    console.log(colors.red("[ID] [LOG] [Pass] [FAV] [DELETE] "))
    let updateid = require('prompt-sync')()('[ID] # ')
    let updatevalues = require('prompt-sync')()('[UPDATE values] # ')
    let updatevalue = {
        log: "updated second log",
        // pass,
        // fav, 
        deleted: false,
    }
    let query = updatevalues.log.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    updatevalues.query = query;
    // let data = db.update(updateid, updatevalues)
    // console.log(data)
} else if (argv[2] === "a" || argv[2] === "append") {
    let appendid = require('prompt-sync')()('[ID] # ')
    let appendlogval = require('prompt-sync')()('[Log] # ')
    let query = appendlogval.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    let data = db.append({ appendid, appendlogval, query })
    console.log(data)
} else if (argv[2] === "e" || argv[2] === "export") {
    let ml = require('prompt-sync')()('[Export all logs] # (y/n) ')
    if ((ml.toUpperCase() == "Y") || (ml.toUpperCase() == "YES")) {
        let res = db.exportlogs()
        console.log(res)
    } else {
        console.log(colors.red('Export failed'))
    }
} else if (argv[2] === "i" || argv[2] === "import") {
    let ml = require('prompt-sync')()('[Import all logs] # (y/n) ')
    if ((ml.toUpperCase() == "Y") || (ml.toUpperCase() == "YES")) {
        let res = db.importlogs()
        console.log(res)
    } else {
        console.log(colors.red('Import failed'))
    }
} else if (argv[2] === "get") {
    let url = require('prompt-sync')()('[URL] # ')
    let data = db.getreq(url)
    console.log(data)
} else if (argv[2] === "post") {
    let url = require('prompt-sync')()('[URL] # ')
    let data = require('prompt-sync')()('[Data] # ')
    let res = db.postreq(url, data)
    console.log(res)
}
else {
    console.log("Bad command!")
}

