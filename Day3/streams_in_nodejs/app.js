/*
<1> Look what I used to create that big file. A writable stream!
const fs = require('fs');
const file = fs.createWriteStream('./large_file.txt');

for (let i = 0; i <= 1000000; i++) {
  file.write('Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n');
}

file.end(); */


//<2>  Using readable stream....

const http = require('http');
const port = 8000;
const fs = require('fs');

const server = http.createServer();

server.on('request',(req,res)=>{
    let rs = fs.createReadStream("./large_file.txt"); //rs means readable stream.
    /*ReadStream reads the contents of file in chunk or parts and 
    everytime it reads a new piece of data, it is going to emit a 'data' event.*/

    res.on('error',(error)=>{
        res.end(error.message);
    })

    //Now, listening to that data event....
    rs.on("data",(chunk)=>{
        res.write(chunk);
        // res.end();  //This will read the first chunk of data only...   
    })

    //Listening to the end event which is triggered when there is no more data in readable stream
    res.on('end',()=>{
        res.end();
    })

})

server.listen(port, '127.0.0.1',(error)=>{
    if(error){
        console.log("Something occured");
        return;
    }
    console.log("Server started on:",port);
})
