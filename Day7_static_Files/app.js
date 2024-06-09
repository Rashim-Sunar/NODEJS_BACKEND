const dotenv = require('dotenv');
dotenv.config({path: './config.env'});

const express = require("express");
const app = express();
const port = process.env.PORT;

console.log(process.env);

app.use(express.static("./public")); //Serving static file inside public folder..
//URL -> 127.0.0.1:3000/template/index.html

app.listen(port, ()=>{
    console.log("Server started on port: ",port);
})