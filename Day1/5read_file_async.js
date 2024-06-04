//READING FILE ASYNCHRONOOUSLY(non-blocking)
const fs = require('fs');

fs.readFile('./5start.txt','utf-8',(err1, data1) => {
    console.log(data1);
    fs.readFile(`./${data1}`,'utf-8', (err2, data2)=>{
        console.log(data2);
        fs.writeFile('./4output.txt', `\n${data1}\n${data2}\n${new Date()}\n`,(err) => {
            console.log("File written successfully");
        })
    })

});  //This task is running on background \nuntil it is completed. 

//Below code is executed first
console.log("This is executed first...");
