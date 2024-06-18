const express = require("express");
const app = express();

const moviesRouter = require('./Routes/moviesRouter');

app.use(express.json())

app.use("/api/v1/movies",moviesRouter); 
//Creating a default route. 
app.all("*", (req, res, next)=>{
    res.status(404).json({
        status: "fail",
        message: `Can't find ${req.originalUrl} on the server`
    });
});

module.exports = app;
