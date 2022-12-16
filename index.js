#!/usr/bin/env node
const db = require("./db");
const os = require("node:os")
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


if (argv[2] === "log" || argv[2] === "l") {
    let inputdata = require('prompt-sync')()('[Log] # ')
    // inputdata = CryptoJS.AES.encrypt(inputdata, `${config.crypto_secret_key}`).toString()
    let pass = require('prompt-sync')().hide('[Pass] # (Null) ')
    let query = inputdata.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    if (pass === "n" || pass === "N" || pass === "null" || pass === "" || pass === "Null") {
        pass = null;
    }
    pass = CryptoJS.AES.encrypt(pass, `${config.crypto_secret_key}`).toString()
    let d = new Date()
    const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    let data = {
        id: Date.now().toString(36),
        log: inputdata,
        pass: pass,
        fav: false,
        deleted: false,
        query,
        date: {
            year: d.getFullYear(),
            month: d.getMonth() + 1,
            date: d.getDate(),
            day: day[d.getDay()],
            now: Date.now(),
        },
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
} else if (argv[2] === "get" || argv[2] === "g") {
    try {
        let data = db.get(input)
        data.map((i) => {
            console.log(colors.yellow(`[Log] # ${i.log}`))
            console.log(colors.green(`[ID] # ${i.id}`))
            console.log(colors.cyan(`[Date] # ${i.date.year}-${i.date.month}-${i.date.date} [${i.date.day}]`))
            console.log(colors.red("----------------------------------------------------------"))
        })
    } catch (error) {
        if (error) throw error;
        console.log(colors.red("Data not found"))
    }
} else if (argv[2] === "del" || argv[2] === "d") {
    let data = db.del(argv[3])
    console.log(data)
} else if (argv[2] === "search" || argv[2] === "s") {
    let inputdata = require('prompt-sync')()('[keyWords] # ')
    let query = inputdata.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    let data = db.search(query)
    data.map((i) => {
        console.log(colors.yellow(`[Log] # ${i.log}`))
        console.log(colors.green(`[ID] # ${i.id}`))
        console.log(colors.cyan(`[Date] # ${i.date.year}-${i.date.month}-${i.date.date} [${i.date.day}]`))
        console.log(colors.red("----------------------------------------------------------"))
    })
} else if (argv[2] === "list") {
    let data = db.list()
    console.log(data)
} else if (argv[2] === "u" || argv[2] === "update") {
    let updateid = "lbqbple0"
    let updatevalues = {
        log: "updated second log",
        // pass,
        // fav, 
        deleted: false,
    }
    let query = updatevalues.log.split(/(\s+)/).filter(function (e) { return e.trim().length > 0; });
    updatevalues.query = query;
    let data = db.update(updateid, updatevalues)
    console.log(data)
}
else {
    console.log("Bad command!")
}
