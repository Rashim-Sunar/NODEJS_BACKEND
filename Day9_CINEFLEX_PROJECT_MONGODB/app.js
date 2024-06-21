const express = require("express");
const app = express();

const moviesRouter = require('./Routes/moviesRouter');
const authRouter = require('./Routes/authRouter');
const customError = require("./Utils/customError");
const globalErrorHandler = require("./controllers/globalErrorHandler");

app.use(express.json())

app.use("/api/v1/movies",moviesRouter); 
app.use("/api/v1/user", authRouter);

//Creating a default route. 
app.all("*", (req, res, next)=>{
    // res.status(404).json({
    //     status: "fail",
    //     message: `Can't find ${req.originalUrl} on the server`
    // });

    //Using global error handling middleware...
   /* 
   const err = new Error(`Can't find ${req.originalUrl} on the server`); //Creating err object (instance) by using Error constructor.
    err.status = 'fail';
    err.statusCode = 404;
    next(err);
    */
    /*Passing err object to next() method, express assumes some error occured, then express will 
    skip all middleware functions which are currently in middleware stack and directly calls global middleware error handling.  */

    //Instantiate customError class
    const err = new customError(`Can't find ${req.originalUrl} on the server`, 404);
    next(err);
});

//Global Error Handling Middleware...
app.use(globalErrorHandler);

module.exports = app;
