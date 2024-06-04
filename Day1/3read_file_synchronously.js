// ->When we use js in browser we can't use it to read and write files
//->But when we use files in node js, it provides us some API's to
// read and write files

//Nodejs is single threaded language i.e. it executes the js code line by line
//This type of execution where the code is executed line by line in a single thread 
//is called synchronous execution

const fs = require('fs'); //import file module..
 
//Rading file synchronously
let textIn = fs.readFileSync('./3input.txt', 'utf-8'); //utf-8 for encoding,,

console.log(textIn);