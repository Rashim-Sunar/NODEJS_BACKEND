const fs = require('fs');
let textIn = fs.readFileSync('./3input.txt','utf-8');

let content = `Data read from input.txt: ${textIn}. \n Date: ${new Date()}`
fs.writeFileSync('./4output.txt',content);