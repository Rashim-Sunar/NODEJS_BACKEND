const express = require("express");
const app = express();
const helmet = require('helmet');
const sanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

const moviesRouter = require('./Routes/moviesRouter');
const authRouter = require('./Routes/authRouter');
const userRouter = require('./Routes/userRouter');
const customError = require("./Utils/customError");
const globalErrorHandler = require("./controllers/globalErrorHandler");

app.use(helmet());

app.use(express.json({limit: "10kb"})) //We can receive maximum of 10Kb data in the request, if more then it will be truncate

app.use(sanitize());
app.use(xss());

app.use("/api/v1/movies",moviesRouter); 
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

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
