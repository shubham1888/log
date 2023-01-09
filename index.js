#!/usr/bin/env node
const db = require("./db");
const os = require("node:os")
const fs = require("node:fs")
const colors = require('ansi-colors');
const CryptoJS = require("crypto-js");
const config = require("./config.json");
try {
    const axios = require('axios')
} catch (error) {}

// const argv = process.argv.slice(2);
const argv = process.argv;
// suppose user is giving log g then to wake up server requert is pre made
axios.get(config.url.api_url).then(res => console.log('')).catch(err => console.log(""))

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

const printdata = (data) => {
    if (data) {
        data.map((i) => {
            if (!i.deleted) {
                console.log(colors.gray(`[ID]       # ${i.id}`))
                console.log(colors.blue(`[Username] # ${i.username}`))
                if (i.hidden) {
                    console.log(colors.red(`[Title]    # Hidden`))
                    console.log(colors.red(`[Body]     # Hidden`))
                } else {
                    console.log(colors.green(`[Title]    # ${i.title}`))
                    console.log(colors.yellow(`[Body]     # ${i.body}`))
                }
                console.log(colors.cyan(`[Date]     # [${timeSince(new Date(Date.now() - i.now))}] ${i.ldate}`))
                console.log(colors.red("--------------------------------------------------------"))
            }
        })
    } else {
        console.log([])
    }
}

const showHiddenData = (data) => {
    if (data) {
        data.map((i) => {
            if (!i.deleted) {
                if (i.hidden) {
                    console.log(colors.gray(`[ID]       # ${i.id}`))
                    console.log(colors.blue(`[Username] # ${i.username}`))
                    console.log(colors.red(`[Title]    # ${i.title}`))
                    console.log(colors.red(`[Body]     # ${i.body}`))
                    console.log(colors.cyan(`[Date]     # [${timeSince(new Date(Date.now() - i.now))}] ${i.ldate}`))
                    console.log(colors.red("--------------------------------------------------------"))
                }
            }
        })
    } else {
        console.log([])
    }
}

const main = async () => {
    if (argv[2] === "l") {
        let title = require('prompt-sync')()('Title : ')
        let body = require('prompt-sync')()('Body : ')
        let category = require('prompt-sync')()('Category : ')
        // let tag = require('prompt-sync')()('Tag : ')
        let hidden = require('prompt-sync')()('Hidden (True/False) : ')
        category = category.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
        if (hidden === "false" || hidden === "f" || hidden === "F" || hidden === "" || hidden === "FALSE") {
            hidden = false;
        } else {
            hidden = true
        }
        let d = new Date()
        let data = {
            id: Date.now().toString(36),
            username: config.userinfo.username,
            pass: config.userinfo.password,
            title: title,
            body: body,
            category: category,
            fav: false,
            deleted: false,
            hidden: hidden,
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
        printdata(data)
    } else if (argv[2] === "d") {
        let delid = require('prompt-sync')()(colors.green('Delete ID : '))
        let data = db.del(delid)
        console.log(data)
    } else if (argv[2] === "s") {
        let inputdata = require('prompt-sync')()('Search : ')
        let query = inputdata.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
        let data = db.search(query)
        printdata(data)
    } else if (argv[2] === "list") {
        let data = db.list()
        console.log(data)
    } else if (argv[2] === "u") {
        console.log(colors.red("[ID] [LOG] [Pass] [FAV] [DELETE] "))
        let uid = require('prompt-sync')()('ID : ')
        let utitle = require('prompt-sync')()('Title : ')
        let ubody = require('prompt-sync')()('Body : ')
        let ucat = require('prompt-sync')()('Category : ')
        ucatarr = ucat.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
        let data = db.update(uid, utitle, ubody, ucatarr)
        console.log(data)
    } else if (argv[2] === "a") {
        let appendid = require('prompt-sync')()('ID : ')
        let appendtitle = require('prompt-sync')()('Title : ')
        let appendbody = require('prompt-sync')()('Body : ')
        let appendcategory = require('prompt-sync')()('Category : ')
        appendcategory = appendcategory.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
        let data = db.append({ appendid, appendtitle, appendbody, appendcategory })
        console.log(data)
    } else if (argv[2] === "e" || argv[2] === "export") {
        let ml = require('prompt-sync')()('Export all logs : (y/n) ')
        if ((ml.toUpperCase() == "Y") || (ml.toUpperCase() == "YES") || (ml.toUpperCase() == "")) {
            let url = config.url.export_url
            db.exportlogs(url).then((res) => {
                console.log(res.data)
            }).catch((e) => { console.log(e) })
        } else {
            console.log(colors.red('Export failed'))
        }
    } else if (argv[2] === "i" || argv[2] === "import") {
        let url = require('prompt-sync')()(`URL : (${config.url.import_url}) `)
        if (url === "") {
            url = config.url.import_url
        }
        // let res = db.importlogs(url)
        db.importlogs(url).then((data) => {
            if (typeof (res) === 'string') {
                fs.writeFileSync(config.import_file_name, data.data)
                // fs.writeFileSync(config.import_info_file_name, data)
            } else {
                fs.writeFileSync(config.fileinfo.import_file_name, JSON.stringify(data.data))
                // fs.writeFileSync(config.import_info_file_name, data)
            }
            console.log({ msg: 'Imported successfully file - import.json' })
        });
    } else if (argv[2] === "get") {
        let url = require('prompt-sync')()(`URL (${config.url.import_url}) : `)
        if (url === "") { url = config.url.import_url }
        // let data = await db.getreq(url)
        let data = await axios.get(url)
        console.log(data.data)
    } else if (argv[2] === "post") {
        let url = require('prompt-sync')()(`URL (${config.url.export_url}) : `)
        if (url === "") { url = config.url.export_url }
        let data = require('prompt-sync')()('Data : ')
        if (typeof (data) === "string") {
            data = JSON.parse(data)
        }
        let res = await axios.post(url, data)
        // let res = db.postreq(url, data)
        console.log(res.data)
    } else if (argv[2] === "del") {
        let url = require('prompt-sync')()(`URL (${config.url.del_url}) : `)
        if (url === "") { url = config.url.del_url }
        let id = require('prompt-sync')()('Id : ')
        if (id) {
            let res = await axios.delete(url + '/' + id)
            console.log(res.data)
        } else {
            console.log(colors.red("Id must required"))
        }
    } else if (argv[2] === "chpass") {
        let pass = require('prompt-sync')().hide(colors.red("New Pass : "))
        if (pass) {
            config.userinfo.password = CryptoJS.AES.encrypt(pass, config.secrets.CRYPTO_SECRET_KEY).toString();
            fs.writeFileSync("./config.json", JSON.stringify(config))
            console.log(colors.green("password changed successfully"))
        } else {
            console.log(colors.red("password unchanged"))
        }
    } else if (argv[2] === "-v") {
        console.log(require("./package.json").version)
    } else if (argv[2] === "reset") {
        config.userinfo.username = null
        config.userinfo.password = null
        config.userinfo.email = null
        config.fileinfo.database_path = null
        config.info = {
            platform: null,
            hostname: null,
            totalmem: null,
        }
        fs.writeFileSync("./config.json", JSON.stringify(config))
        console.log(colors.green("Reset all data successfully"))
    } else if (argv[2] === "show") {
        let res = db.get({ else: "" })
        showHiddenData(res)
    } else if ((argv[2] === "whoami") || (argv[2] === "profile")) {
        console.log("username : ", config.userinfo.username)
        console.log("Password : ", config.userinfo.password)
        console.log("Email    : ", config.userinfo.email)
    }
    else {
        console.log("Bad command!")
    }
}

const login = () => {
    console.log(colors.red("Login"))
    globalpass = require('prompt-sync')().hide(colors.red('Password : '))
    if (globalpass === null) {
        process.exit()
    }
    var bytes = CryptoJS.AES.decrypt(config.userinfo.password, `${config.secrets.CRYPTO_SECRET_KEY}`);
    var originalPass = bytes.toString(CryptoJS.enc.Utf8);
    if (globalpass === originalPass) {
        console.log(colors.yellow(`Login as ${config.userinfo.username}`))
        main()
    } else {
        console.log(colors.red(`Login failed`))
        login()
    }
}

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
    if (config.userinfo.email === null) {
        obj.email = require('prompt-sync')()('Email : ')
        if (obj.email === '') {
            obj.email = null
        }
    }
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
}
init()
login()
