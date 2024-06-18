const express = require("express");
const app = express();

const moviesRouter = require('./Routes/moviesRouter');

app.use(express.json())

app.use("/api/v1/movies",moviesRouter); 

//Creating a default route. 
app.all("*", (req, res, next)=>{
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on the server`
    // });

    //Using global error handling middleware...
    const err = new Error(`Can't find ${req.originalUrl} on the server`); //Creating err object (instance) by using Error constructor.
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
    /*Passing err object to next() method, express assumes some error occured, then express will 
    skip all middleware functions which are currently in middleware stack and directly calls global middleware error handling.  */
});

//Global Error Handling Middleware...
app.use((error, req, res, next)=>{
    error.statusCode = error.statusCode || 500; //500 is for internal server error..
    error.status = error.status || 'error';
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message
    });
});

module.exports = app;
