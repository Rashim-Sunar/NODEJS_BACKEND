const customError = require("../Utils/customError");
const Movie = require("../models/movieModel");
const ApiFeatures = require("./../Utils/ApiFeatures");
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');

exports.getHighestRated = (req, res, next) => {
    req.query.limit = '2';
    req.query.sort = '-ratings';
    next();
}

//ROUTE HANDLER
exports.getAllMovie = asyncErrorHandler(async(req, res, next)=>{ 
    //On the instance of ApiFeatures class, chaining the different methods 
    const features = new ApiFeatures(Movie.find(), req.query).filter().sort().limitFields().pagination();
    let movies = await features.query;
    // For mongoose 6.0 or less
    // const excludeFields = ['sort','page','limit','fields']; //fields to be excluded from query obj
    // let queryObj = {...req.query} //creating shallow copy of query object..
    // excludeFields.forEach((elem)=>{
    //     delete queryObj[elem];
    // });

    // const movies = await Movie.find(queryObj);
    // console.log(queryObj);

      //Filtering the movies from string query...
      //For eg. 127.0.0.1:3000/api/v1/movies/?duration=90&rating=4.5&sort=1&page=5 , in this url after '?' duation and ratings are query strings..
    //   console.log(req.query);
    //   const movies = await Movie.find(req.query);

    //Filtering movies by using mongoose filtering method
    /*const movies = await Movie.find()
            .where("duration").equals(req.query.duration)
            .where("rating").gte(req.query.rating);
    */
/*
    //Advance filtering of movies Eg. url--> 127.0.0.1:3000/api/v1/movies/?duration[gte]=120&rating[gte]=4.5&price[lte]=50.0
    let queryString = JSON.stringify(req.query);
    // console.log(queryString)
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match)=> `$${match}`); //using regular expression
    const queryObj = JSON.parse(queryString);
    // console.log(queryObj);
    // const movies = await Movie.find(queryObj);
    // .find({duration: {$gte: 120}, rating: {$gte: 4.5}, price: {$lt: 50.0}}), mongodb find() method

    //Sorting movies on the basis of field...
    //127.0.0.1:3000/api/v1/movies/?sort=-price,rating  --> -ve sign for descending order
    const excludeFields = ['sort','page','limit','fields']; //fields to be excluded from query obj
    let newQueryObj = {...queryObj} //creating shallow copy of query object..
    excludeFields.forEach((elem)=>{
        delete newQueryObj[elem];
    });
    let query = Movie.find(newQueryObj); //returns query object so that we can use mongoose query method in it like .sort().
    
    if(req.query.sort){
        const sortBy = req.query.sort.split(",").join(" ");
        // console.log(sortBy);
        query = query.sort(sortBy); //If the sort field consists only one element
                // query.sort('releaseYear rating'); -->if sort field consists multiple elements
    }else{
        query = query.sort("-createdAt"); //newly created at the top.
    }

    //LIMITING FIELDS - (returns those fields only which are requested by user.)
    // 127.0.0.1:3000/api/v1/movies/?rating[lte]=4.6&sort=duration&fields=name,duration,ratings,price
    if(req.query.fields){
        const fields = req.query.fields.split(",").join(" ");
        query = query.select(fields) //.select() is also a mongoose query method...
                // .select("name price duration description") --> contains the fields which are to be returned 
    }else{
        query = query.select("-__v"); //Selecting all fields except __v using '-' (i.e. excluding field __v)
    }

    // PAGINATION.....
    const page = req.query.page*1 || 1;
    const limit = req.query.limit*1; //specify how many movies in one page? 
    const skip = (page-1)*limit; //number of movies to skip for the given page..
    query = query.skip(skip).limit(limit); //specify which page to show how many documents.
    if(req.query.page){
        const moviesCount = await Movie.countDocuments();
        if(skip >= moviesCount){
            throw new Error("This page is not found");
        }
    }


    const movies = await query;
    */

      res.status(200).json({
        status: "success",
        length: movies.length,
        data: {
            movies
        }
      });
}); 

exports.getMovie = asyncErrorHandler(async(req, res, next)=>{
        const movie = await Movie.findById(req.params.id);
         //If movie with id is not found, then create a custom error and call globalErrorHandling..
         if(!movie){
            const err = new customError("Movie with that ID doesn't exist.", 404); //FILE NOT FOUND ERROR.
            return next(err); //calling global error handling.
         }

        res.status(201).json({
            status: "success",
            data: {
                movie
            }
        })
});


//Error handled in async function without using try..catch block. Similarly, we can use for other route handling functions..
exports.createMovie = asyncErrorHandler(async(req, res, next)=>{ //Here, async function is passed as parameter.
        const movie =await Movie.create(req.body);
        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })
});

exports.updateMovie = asyncErrorHandler(async(req, res, next)=>{
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        //If movie with id is not found, then create a custom error and call globalErrorHandling..
        if(!movie){
            const err = new customError("Movie with that ID doesn't exist.", 404); //FILE NOT FOUND ERROR.
            return next(err); //calling global error handling.
         }

        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })
    
});

exports.deleteMovie = asyncErrorHandler(async(req, res, next)=>{
        const movie = await Movie.findByIdAndDelete(req.params.id);
        //If movie with id is not found, then create a custom error and call globalErrorHandling..
        if(!movie){
            const err = new customError("Movie with that ID doesn't exist.", 404); //FILE NOT FOUND ERROR.
            return next(err); //calling global error handling.
         }

        res.status(204).json({
            status: "success",
            data: {
                movie
            }
        })
});

//Using aggregate pipeline...
exports.getMovieStat = asyncErrorHandler(async(req, res, next) =>{
        const stats = await Movie.aggregate([
            {$match: {duration: {$gte: 90}}},
            // $group stage is applied to the documents satifying $match stage
            {$group: {
                // _id: null,  //Grouping in a single
                _id: '$releaseYear',
                avgRating: {$avg: '$rating'},
                avgPrice: {$avg: '$price'},
                maxPrice: {$max: '$price'},
                minPrice: {$min: '$price'},
                moviesCount: {$sum: 1}
            }},
         // sort stage is applied to the result og above two stages.
         {$sort: { minprice: 1}}, //sorting in ascending order based on minprice
        {$match: {maxPrice: {$gte: 20}}},

        ]);

        res.status(200).json({
            status: "success",
            length: stats.length,
            data: {
                stats
            }
        })
});

//Some more stages and operators of aggregation pipeLine...
exports.getMovieByGenre = asyncErrorHandler(async(req, res, next) => {
        let genre = req.params.genre;
        console.log(genre)
        const movies = await Movie.aggregate([
            /*destructures a document with a field assigned with array and
            and creates multiple documents from a document based on the array field*/
            {$unwind: "$genres"} ,
            {$group: {
                _id: "$genres",
                movieCount: {$sum: 1},
                movies: {$push: '$name'} //pushing the movie with same genre in movies field
            }},

            {$addFields: {genre: "$_id"}},
            {$project: {_id: 0}}, //specify which fields to return and not (1 means return)
            {$sort: {movieCount: -1}}, //sorting in descending order by movieCount field.
            // {$limit: 3},
            {$match: {genre: genre}}

        ]);

        res.status(200).json({
            status: "success",
            length: movies.length,
            data: {
                movies
            }
        })
});
