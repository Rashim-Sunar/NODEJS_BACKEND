const express = require('express');
const app = express();
const http = require('http');
const {Server} = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static('./public'));

app.get("/", (req, res) => {
    res.sendFile("./public/index.html")
});

//sokcet here means client
io.on('connection', (socket)=>{
    console.log("A new user connected", socket.id);
    socket.on("chat message", (msg) => {
        console.log("Message: "+msg);
    })
})

server.listen(8000, ()=>{
    console.log("Server listening on port: 8000");
})
