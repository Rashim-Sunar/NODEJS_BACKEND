//EVENT LOOP IN PRACTICE.......
const fs = require("fs");

console.log("Program has started");

//Stored in 2nd phase of event loop
fs.readFile("./3npm.txt",()=>{
    console.log("File read completed");

    //Stored in 1st phase of event loop.
    setTimeout(()=>{
        console.log("Timer callBack executed");
    },0);

    //Stored in 3rd phase of event loop.
    setImmediate(()=>{console.log("SetImmediate callBack executed")});

    process.nextTick(()=>{console.log("Process.nextTick callback executed")});

})

console.log("Program has completed");
 
