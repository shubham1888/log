#!/usr/bin/env node
const db = require("./db");
const os = require("node:os")
const { v4: uuidv4 } = require('uuid');

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
    let d = new Date()
    const day = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    let data = {
        id: uuidv4(),
        log: input,
        pass: null,
        fav: false,
        deleted: false,
        query: query,
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
    const res = db.set(JSON.stringify(data))
    console.log(res)
} else if (argv[2] === "get" || argv[2] === "g") {
    let data = db.get(input)
    console.log(data)
} else if (argv[2] === "del" || argv[2] === "d") {
    let data = db.del(input)
    console.log(data)
} else if (argv[2] === "search" || argv[2] === "s") {
    let data = db.search(input,query)
    console.log(data)
}
else {
    console.log("Bad command!")
}
