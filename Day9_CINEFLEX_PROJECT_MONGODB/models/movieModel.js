const mongoose = require('mongoose');
const fs = require('fs');
//You can also use validatorjs to validate the fields

const movieSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, "Name field is required!"],
        unique: true,
        //Data Validators: built-in-validators...
        maxlength: [100, "Movie name mustn't have more than 100 characters"],
        minlength: [5, "Movie name must have more than 5 characters."],
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
        // default: 1.0
        //Built-in validator
        // min: [1, "rating must be 1.0 or more"],
        // max: [10, "rating must be 10.0 or below"]

        //MONGOOSE CUSTOM VALIDATOR...
        validate:{
            validator: function(value){
                return value >= 1 && value <= 10;
            },
            message: "Rating {VALUE} must be 1 or above 1 and below 10 or exactly 10."
        }
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
        required: [true, "Genre field is required"],
        //genres can be only from below data, otherwise validation error occurs...
        /*enum: {
            values: ["Action", "Adventure", "Sci-Fi", "Thriller", "Crime", "Drama", "Comedy", "Romance", "Biography"],
            message: "This genre doesn't exit."
        }*/
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

//-----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------

//MONGOOSE OR DOCUMENT MIDDLEWARE--> runs before or after mongoose event happens(eg. save, update, delete, etc.)

//Executed before document is saved(pre-hook)...
//save event is triggered only is .save() or .create() method is performed. 
movieSchema.pre('save', function(next) {
    // console.log(this); //Here, this keyword points to document object
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

//-----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------

// QUERY MIDDLEWARE IN MONGOOSE...-->runs before or after certain query is done..
/*
movieSchema.pre('find', function(next){
    //Here, this keywowrd stores a query object since, .find() method emits find event along with query object.
    this.find({releaseDate: {$lte: Date.now()}});
    // database may contain the information of the movies which are not yet released, is such case we shouldn't
    //return those movies which are not yet published. So returning released movie only... 
    next();
})
*/
//Above query method is only applied for find() method but not for others like findOne(), findByIdAndDelete(), etc.
//So using regular expression so that query middleware is applied to all methods which started by 'find' word.
movieSchema.pre(/^find/, function(next) {
    this.find({releaseDate: {$lte: Date.now()}});
    this.startTime = Date.now();
    next();
}) 
//Calculating time to fetch the documents
movieSchema.post(/^find/, function(docs, next) {
    this.find({releaseDate: {$lte: Date.now()}});
    this.endTime = Date.now();
    let content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the document\n`;
    fs.writeFileSync("./Log/log.txt", content, {flag: 'a'}, (err)=>{
        console.log(err.message);
    });
    next();
}) 

//--------------------------------------------------------------------------------------------------------------------------------
//--------------------------------------------------------------------------------------------------------------------------------

//AGGREGATION MIDDLEWARE --> we should perform aggregation on the movies which are already released. So, we can use aggregate middleware
// to filter the already released movies..

movieSchema.pre('aggregate', function(next){
    // console.log(this.pipeline()); //Here, this keyword points to currently processign aggregation object
    this.pipeline().unshift({$match: {releaseDate: {$lte: new Date()}}});  // .unshift() method is used to add element at beggining of array.
    next();
})



const Movie = mongoose.model('movie', movieSchema);

module.exports = Movie;