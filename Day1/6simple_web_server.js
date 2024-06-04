//Creating a simple web server using "http" module

const http = require("http"); //"http" module return a object
const port = 8000;

// .createServer() method creates a server and return a server object
const server = http.createServer((req, res) => {
    res.end("This is responded")
    console.log("A new request received");
    console.log(req);
});

//Starting the server....
server.listen(port, '127.0.0.1',()=>{
    console.log("Server started on port ", port);
})