#!/usr/bin/env node
const db = require("./db");
const os = require("node:os")
const fs = require("node:fs")
const colors = require('ansi-colors');
const CryptoJS = require("crypto-js");
const axios = require('axios')
const config = require("./config.json");
// console.clear()

process.on('SIGINT', () => {
    console.log('Process cancelled');
    // Do something when the SIGINT signal is received
});

// const argv = process.argv.slice(2);
const argv = process.argv;
let input = ""
for (let i = 3; i < argv.length; i++) {
    command = argv[i];
    input = input + command + " ";
}
input = input.substring(0, input.length - 1)
let query = input.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });

let loginfailedtimes = 0
const init = () => {
    let obj = config.userinfo;
    if (config.userinfo.username === null) {
        obj.username = require('prompt-sync')()('Username : ')
        if (obj.username === '') {
            obj.username = null
        }
    }
    if (config.userinfo.password === null) {
        obj.password = require('prompt-sync')().hide('Password : ')
        if (obj.password === '') {
            obj.password = null
        } else {
            obj.password = CryptoJS.AES.encrypt(obj.password, config.secrets.CRYPTO_SECRET_KEY).toString();
        }
    }
    // if (config.userinfo.email === null) {
    //     obj.email = require('prompt-sync')()('Email : ')
    //     if (obj.email === '') {
    //         obj.email = null
    //     }
    // }
    if (config.fileinfo.database_path === null) {
        config.fileinfo.database_path = __dirname
    }
    config.userinfo = obj;
    config.info = {
        platform: os.platform(),
        hostname: os.hostname(),
        totalmem: os.totalmem(),
    }
    config.permissions = {
        read: true,
        update: true,
        del: true,
        mkfav: true,
        setpass: true
    }
    fs.writeFileSync("./config.json", JSON.stringify(config))
    globalpass = require('prompt-sync')().hide('Password : ')
    var bytes = CryptoJS.AES.decrypt(config.userinfo.password, `${config.secrets.CRYPTO_SECRET_KEY}`);
    var originalPass = bytes.toString(CryptoJS.enc.Utf8);
    if (globalpass === originalPass) {
        console.log(`Login as ${config.userinfo.username}`)
    } else {
        console.log(`Login failed`)
        loginfailedtimes++;
        if (loginfailedtimes < 3) {
            console.log("Try again")
            init()
        }
        process.exit(1)
    }
}
// init()

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

if (argv[2] === "l") {
    let title = require('prompt-sync')()('Title : ')
    let body = require('prompt-sync')()('Body : ')
    let category = require('prompt-sync')()('Category : ')
    // let tag = require('prompt-sync')()('Tag : ')
    let hidden = require('prompt-sync')()('Hidden (True/False) : ')
    let titlequery = title.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    let bodyquery = body.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    category = category.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    if (hidden === "false" || hidden === "f" || hidden === "F" || hidden === "" || hidden === "FALSE") {
        hidden = false;
    } else {
        hidden = true
    }
    // if (pass !== null) {
    //     pass = CryptoJS.AES.encrypt(pass, `${config.crypto_secret_key}`).toString()
    // }
    let d = new Date()
    let data = {
        id: Date.now().toString(36),
        username: config.userinfo.username,
        pass: config.userinfo.password,
        title: title,
        body: body,
        fav: false,
        deleted: false,
        hidden: hidden,
        category: category,
        titlequery: titlequery,
        bodyquery: bodyquery,
        lastupdated: null,
        date: d,
        now: Date.now(),
        ldate: d.toString(),
        utc: d.toUTCString(),
        updates: []
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
                console.log(colors.green(`[ID] # ${i.id}`))
                console.log(colors.green(`[Username] # ${i.username}`))
                console.log(colors.green(`[Title] # ${i.title}`))
                console.log(colors.yellow(`[Body] # ${i.body}`))
                console.log(colors.cyan(`[Date] # ${i.ldate} [${timeSince(new Date(Date.now() - i.date.now))}]`))
                console.log(colors.red("--------------------------------------------------------"))
            }
        })
    } else {
        console.log([])
    }
} else if (argv[2] === "d") {
    let data = db.del(argv[3])
    console.log(data)
} else if (argv[2] === "search" || argv[2] === "s") {
    let inputdata = require('prompt-sync')()('Search : ')
    let query = inputdata.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    let data = db.search(query)
    if (data) {
        data.map((i) => {
            if (!i.deleted) {
                console.log(colors.green(`[ID] # ${i.id}`))
                console.log(colors.green(`[Username] # ${i.username}`))
                console.log(colors.green(`[Title] # ${i.title}`))
                console.log(colors.yellow(`[Body] # ${i.body}`))
                console.log(colors.cyan(`[Date] # ${i.ldate} [${timeSince(new Date(Date.now() - i.date.now))}]`))
                console.log(colors.red("--------------------------------------------------------"))
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
    let url = require('prompt-sync')()(`[URL] (${config.default.import_url}) # `)
    if (url === "") {
        url = config.default.import_url
    }
    // let res = db.importlogs(url)
    db.importlogs(url).then((data) => {
        if (typeof (res) === 'string') {
            fs.writeFileSync(config.import_file_name, data.data)
            // fs.writeFileSync(config.import_info_file_name, data)
        } else {
            fs.writeFileSync(config.import_file_name, JSON.stringify(data.data))
            // fs.writeFileSync(config.import_info_file_name, data)
        }
        console.log({ msg: 'Imported successfully file - import.json' })
    });
} else if (argv[2] === "get") {
    const getres = async () => {
        let url = require('prompt-sync')()('[URL] # ')
        // let data = await db.getreq(url)
        let data = await axios.get(url)
        // let json = data.json()
        console.log(data.data)
    }
    getres()
} else if (argv[2] === "post") {
    const postdata = async () => {
        let url = require('prompt-sync')()('[URL] # ')
        let data = require('prompt-sync')()('[Data] # ')
        if (typeof (data) === "string") {
            data = JSON.parse(data)
        }
        let res = await axios.post(url, data)
        // let res = db.postreq(url, data)
        console.log(res.data)
    }
    postdata()
}
else {
    console.log("Bad command!")
}

