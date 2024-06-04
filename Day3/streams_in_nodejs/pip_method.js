const http = require('http');
const fs = require('fs');
const port = 8000;

const server = http.createServer();

server.on('request',()=>{
    const rs = fs.createReadStream("./large_file.txt");
    //pipe() method helps to fix the problem of back pressure
    //backpressure --> The speed(mbps) of data coming in and going out are different.
    //pipe() method is available on readable stream only but not for writable stream.
    rs.pipe(res);
})

server.listen(port, '127.0.0.1',(error)=>{
    if(error){
        console.log(error.message);
        return;
    }
    console.log("Server started on port: ",port);
})


