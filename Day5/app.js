const express = require("express");
const app = express();
const fs = require('fs');
const port = 3000;

let movies = JSON.parse(fs.readFileSync("./movies.json",'utf-8'));

app.get("/api/v1/movies",(req,res)=>{ 
    //Using JSON JSON formatting to send the json data
    res.status(200).json({
        status: "success",
        data: {
            movies: movies
        }
    });
});

app.listen(port,()=>{
    console.log("Server has started on port",port)
});