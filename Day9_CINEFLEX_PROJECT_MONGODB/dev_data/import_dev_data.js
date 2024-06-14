//Simple script to import dev-data from json file to mongodb..
// This code doesn't have anything to do with the project. Only for practice.

const mongoose = require('mongoose');
const fs = require("fs");
const dotenv = require('dotenv');
const Movie = require("../models/movieModel");

dotenv.config({path: "./config.env"});
const url = process.env.CONNECT_STR;

mongoose.connect(url, {
    useNewUrlParser: true
}).then((con)=>{
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log(err.message);
})

const movies = JSON.parse(fs.readFileSync("./dev_data/movies.json", 'utf-8'));
//Since json file and this file is in same folder, needs to specify the complete path of json file because this script is going to be run from command line..

const deleteMovies = async() => {
    try{
        await Movie.deleteMany();
        console.log("Movies deleted from database");
    }catch(error){
        console.log(error.message);
    }
    process.exit();
}

const createMovies = async() => {
    try{
        await Movie.create(movies);
        console.log("Movies inserted into database from json file successfully");
    }catch(error){
        console.log(error.message);
    }
    process.exit();
}

// console.log(process.argv);
if(process.argv[2] === "--import"){
    createMovies();
}
if(process.argv[2] === "--delete"){
    deleteMovies();
}


