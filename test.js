#!/usr/bin/env node
const fs = require("node:fs")
const config = require("./config.json");
// fs.mkdir(`${config[0].fileinfo.database_folder}`, { recursive: true }, (e, d) => {
//     if (e) throw e;
//     console.log(`Database created`)
// })
// // console.log(`${new Date().getMonth()}-${new Date().getFullYear()}.json`)
// // fs.writeFileSync(`${config[0].fileinfo.database_folder}/${new Date().getMonth()}-${new Date().getFullYear()}.${config[0].fileinfo.database_file_extension}`, "")
// fs.readdir('./database/')


console.log(config)
config.permissions.setpass=false
console.log(config)  
 fs.writeFileSync("./config.json", JSON.stringify(config))


