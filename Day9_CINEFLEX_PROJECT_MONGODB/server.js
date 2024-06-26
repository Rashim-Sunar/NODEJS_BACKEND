const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});
const port = process.env.PORT || 3000;
const url = process.env.CONNECT_STR;
const mongoose = require('mongoose');
const Movie = require('./models/movieModel');


//Handling uncaught error for synchronous codes.. This handling must be at the top of the codes before importing app module.
process.on("uncaughtException", (err) => {
    console.log(err.name+ ": " +err.message);
    console.log("Uncaught Error has been handled");
    process.exit(1);
})

const app = require('./app');

mongoose.connect(url, {
    useNewUrlParser: true,
}).then((con)=>{
    // console.log(con);
    console.log("Database connected successfully");
})
// .catch((err)=>{
//     console.log("Error conneting to databse");
// });

// const m1 = new Movie({
//     name: "Heropanti3",
//     duration: 130,
//     description: "This is very good film",
// });

// m1.save()
//     .then(doc => console.log(doc))
//     .catch(err => console.log("Error creating document",err.message));

const server = app.listen(port,()=>{
    console.log("Server has started on port",port)
});

//Handling rejected promises globally.. There are some errors which occurs outside express like mongodb connection. These can be handled as follows...
process.on("unhandledRejection" ,(error)=>{
    console.log(error.name, error.message);
    console.log("unhandledRejection occured! Shutting down.....");
    server.close(()=>{
        process.exit(1);
    })
});

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------
//UNCAUGHT EXCEPTIONS 
//  --> All the errors that occurs in our synchronous code but are not handled anywhere are called uncaught exceptions. It doesn't have anything to do with the server.
//     In our application, we don't have any uncaught exceptions, so let's introduce an uncaught exception by trying to log an undefined variable 'x'.

// console.log(x);  //Here, you get an error, x is not defined. This is uncaught exception, since it runs synchronously.
