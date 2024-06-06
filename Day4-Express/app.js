//Importing third party package: express...
const express = require('express');
//Importing express package returns a function which we store in a variable named express.
const app = express(); //Calling express() function, returns a object
const port = 3000;

// ROUTE = HTTP methode(get, post, put, delete) + URL....
app.get("/",(req, res)=>{
    //This callback function is also called route handler...
    // res.status(200).send("<h1>Hello from express server</h1>");
    //Content-Type of response is bydefault text/html

    // Sending JSON data 
    res.status(200).json({message:"Hello json", status:200});
});

//Creating a server
app.listen(port,()=>{
    console.log("Server started");
})