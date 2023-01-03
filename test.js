#!/usr/bin/env node
const fs = require("node:fs")
const config = require("./config.json");
fs.mkdir(`${config.fileinfo.database_folder}`, { recursive: true }, (e, d) => {
    if (e) throw e;
    console.log(`Database created`)
})
// console.log(`${new Date().getMonth()}-${new Date().getFullYear()}.json`)
// fs.writeFileSync(`${config[0].fileinfo.database_folder}/${new Date().getMonth()}-${new Date().getFullYear()}.${config[0].fileinfo.database_file_extension}`, "")
let jsondata = []

const directoryPath = './database/';
fs.readdirSync(directoryPath).forEach(fileName => {
  const fileContent = fs.readFileSync(directoryPath + '/' + fileName, 'utf8');
  const data = JSON.parse(fileContent);
  jsondata.push(data)
});
// jsondata=jsondata[0]
console.log(jsondata);





