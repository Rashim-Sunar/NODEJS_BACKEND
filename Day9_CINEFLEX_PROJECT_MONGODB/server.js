const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});

const app = require('./app');
const mongoose = require('mongoose');

const Movie = require('./models/movieModel');

const port = process.env.PORT || 3000;
const url = process.env.CONNECT_STR;

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