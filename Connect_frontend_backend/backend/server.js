// const express = require('express'); //This means assembling js file using common JS
import express from 'express'; //It works a little bit asynchronously i.e. assemble JS file like module
//For this, we need to add "type":"module" in package.json...


const app = express();
import cors from 'cors'


// Use CORS middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to match your frontend's origin
  }));

app.get("/",(req, res)=>{
    res.send("Server is ready");
});

//GET LIST OF 5 JOKES...
app.get("/api/jokes", (req, res)=>{
    const jokes = [
        {id:1, title: 'joke1', content: 'This is a first joke'},
        {id:2, title: 'joke2', content: 'This is a second joke'},
        {id:3, title: 'joke3', content: 'This is a third joke'},
        {id:4, title: 'joke4', content: 'This is a fourth joke'},
        {id:5, title: 'joke5', content: 'This is a fifth joke'},       
    ];

    res.send(jokes);

});

const port = process.env.PORT || 3000;

app.listen(port, (err)=>{
    if(!err){
        console.log("Server listening on port: "+port);
    }
});