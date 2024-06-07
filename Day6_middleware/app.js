const express = require("express");
const app = express();
const port = 3000;
const morgan = require("morgan");

const logged = function(req, res, next){
    console.log("This is middleware logged message");
    next();
}

//These middlewares are applied to all the routes i.e application
app.use(logged); //This is application level middleware...
app.use(express.json()); //This is built-in middleware...
app.use(morgan("dev")) //http request logger third party middleware....

app.get("/",(req, res)=>{
    res.status(200).json({
        status: "success",
        message: "This is home"
    })
})

app.listen(port,()=>{
    console.log("Server started on port:",port);
})