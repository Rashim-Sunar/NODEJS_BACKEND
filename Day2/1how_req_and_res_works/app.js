const http = require("http"); 
const port = 8000;
const fs = require('fs');

const index = fs.readFileSync('./index.html','utf-8');

const server = http.createServer((req, res) => {
    console.log(req);
    console.log(res);
    res.end(index)
});


server.listen(port, '127.0.0.1',()=>{
    console.log("Server started on port ", port);
});

/*Routing defines the way in which the client requests are handled by the application endpoints.
We can make our applications to respond to different URL's with different responses using routing
Routing basically means implementing different actions for different URL's.
 */