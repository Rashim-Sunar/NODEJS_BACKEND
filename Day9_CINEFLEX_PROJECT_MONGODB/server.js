const dotenv = require('dotenv');
dotenv.config({path:"./config.env"});

const app = require('./app');
const mongoose = require('mongoose');

const port = process.env.PORT || 3000;
const url = process.env.CONNECT_STR;

mongoose.connect(url, {
    useNewUrlParser: true,
}).then((con)=>{
    // console.log(con);
    console.log("Database connected successfully");
}).catch((err)=>{
    console.log("Error conneting to databse");
});

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name field is required!"],
        unique: true
    },
    duration: {
        type: Number,
        required: [true, "Duration field is required"],
    },
    description: {
        type: String,
        required: [true, "Description field is required"],
    },
    rating: {
        type: Number,
        default: 1.0
    }
});

const Movie = mongoose.model('movie', movieSchema);

const m1 = new Movie({
    name: "Heropanti2",
    duration: 130,
    description: "This is very good film",
});

m1.save()
    .then(doc => console.log(doc))
    .catch(err => console.log(err.message));


app.listen(port,()=>{
    console.log("Server has started on port",port)
});