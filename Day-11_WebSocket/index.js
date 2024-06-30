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
    socket.on("chat message", (msg) => {  //listening to the emitted event 'chat message' by client
        // console.log("Message: "+msg);

        io.emit("message", msg); //Broadcasting the information got from a client to every other users.
    })
})

server.listen(8000, ()=>{
    console.log("Server listening on port: 8000");
})
