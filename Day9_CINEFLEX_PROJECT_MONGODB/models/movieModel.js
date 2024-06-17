const mongoose = require('mongoose');
const fs = require('fs');

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name field is required!"],
        unique: true,
        trim: true //removes white spaces at begginiing and end if any
    },
    duration: {
        type: Number,
        required: [true, "Duration field is required"],
    },
    createdBy: String,
    description: {
        type: String,
        trim: true,
        required: [true, "Description field is required"],
    },
    rating: {
        type: Number,
        default: 1.0
    },
    totalRatings: {
        type: Number
    },
    releaseYear: {
        type: Number,
        required: [true, "Release Year is required field"]
,
    },
    releaseDate: {
        type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false // i.e. createdAt field is never shown to the user..
    },
    genres: {
        type: [String], //array of strings..
        required: [true, "Genre field is required"]
    },
    directors: {
        type: [String],
        required: [true, "Directors field is required"]
    },
    coverImage: {
        type: String,
        required: [true, "coverImage is required field"]
    },
    actors: {
        type: [String],
        required: [true, "Actors field is required"]
    },
    price: {
        type: Number,
        required: [true, "Price is required field"]
    }
}, {
    toJSON: {virtuals: true}, //When we output the data in JSON format, then setting virtual properties too.
    toObject: {virtuals: true}//WHen output data in object format, then return virtual properties also.
});

//Creating virtual fields i.e these fields are not stored in database but returned to the user
//We can't use virtual fields for query, like Movie.find({durationInHours: 2}), wrong...
movieSchema.virtual("durationInHours").get(function(){
    return this.duration / 60;
})

//MONGOOSE OR DOCUMENT MIDDLEWARE--> runs before or after mongoose event happens(eg. save, update, delete, etc.)

//Executed before document is saved(pre-hook)...
//save event is triggered only is .save() or .create() method is performed. 
movieSchema.pre('save', function(next) {
    // console.log(this);
    this.createdBy = "Rashim";
    next();
});

//post hook --> executes after document is saved..
movieSchema.post('save', function(doc, next){
    let content = `A new movie with name ${doc.name} has been created by user ${doc.createdBy}\n`;
    fs.writeFileSync("./Log/log.txt", content, {flag: 'a'}, (err)=>{
        console.log(err.message);
    });

    next();
})


const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;