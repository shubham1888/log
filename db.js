#!/usr/bin/env node
const fs = require("node:fs")

const set = (props) => {
    if (fs.existsSync("log")) {
        const res = fs.readFileSync(`log/log.json`, { encoding: 'utf8', flag: 'r' });
        if (res) {
            let parsedData = JSON.parse(res);
            let arr = new Array();
            parsedData.map((i) => { arr.push(i) })
            arr.push(JSON.parse(props));
            fs.writeFileSync(`log/log.json`, JSON.stringify(arr))
            return JSON.parse(props).id;
        } else {
            fs.writeFileSync(`log/log.json`, "[]")
        }
    } else {
        fs.mkdir("log", { recursive: true }, (e, d) => {
            if (e) throw e;
            console.log(`Using this log utility first time!`)
        })
        fs.writeFileSync(`log/log.json`, `[${props}]`)
        return JSON.parse(props).id;
    }
}

const get = (props) => {
    if (fs.existsSync("log")) {
        const res = fs.readFileSync(`log/log.json`, { encoding: 'utf8', flag: 'r' });
        if (res) {
            let parsedData = JSON.parse(res)
            if (props === "") {
                let arr = new Array();
                parsedData.map((i) => {
                    if (i.deleted === false) {
                        arr.push(i)
                    }
                })
                return arr;
            } else {
                return { msg: "Data not found" }
            }
        } else {
            console.log("Data not found")
        }
    } else {
        console.log("Log folder not found!")
    }
}

const del = (id) => {
    if (fs.existsSync("log")) {
        const res = fs.readFileSync(`log/log.json`, { encoding: 'utf8', flag: 'r' });
        if (res) {
            let parsedData = JSON.parse(res)
            let returnID = ""
            if (id === "all" || id === "a") {
                const { prompt } = require('enquirer');
                let is_Deleted = false;
                prompt({
                    type: 'confirm',
                    name: 'confirm',
                    message: 'Do you want to delete all data'
                }).then(answer => {
                    if (answer.confirm) {
                        let arr = new Array();
                        fs.writeFileSync(`log/log.json`, JSON.stringify(arr))
                        is_Deleted = true;
                    }
                });
                if (is_Deleted) {
                    return "All log deleted";
                }
                return "Process cancelled"
            } else {
                let arr = new Array();
                parsedData.map((i) => {
                    if (i.id === id) {
                        i.deleted = true;
                        returnID = i.id;
                    }
                    arr.push(i)
                })
                fs.writeFileSync(`log/log.json`, JSON.stringify(arr))
                return returnID
            }
        } else {
            console.log("Data not found")
        }
    } else {
        console.log("Log folder not found!")
    }
}

const search = (input, a) => {
    if (fs.existsSync("log")) {
        const res = fs.readFileSync(`log/log.json`, { encoding: 'utf8', flag: 'r' });
        if (res) {
            let parsedData = JSON.parse(res)
            let arr = new Array();
            let result = []
            parsedData.map((i) => {
                let temparr = i.query;
                for (let j = 0; j < a.length; j++) {
                    for (let k = 0; k < temparr.length; k++) {
                        if (a[j] === i.query[k]) {
                            result.push(i)
                        }
                    }
                }
            })
            return result;
        } else {
            console.log("Data not found")
        }
    } else {
        console.log("Log folder not found!")
    }
}

module.exports = {
    set,
    get,
    del,
    search,
}