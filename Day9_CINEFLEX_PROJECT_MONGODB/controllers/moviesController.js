const Movie = require("../models/movieModel");

//ROUTE HANDLER
exports.getAllMovie = async(req,res)=>{ 
   try{

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

      res.status(200).json({
        status: "success",
        length: movies.length,
        data: {
            movies
        }
      });
   }catch(error){
    res.status(400).json({
        status: "fail",
        message: error.message
    });
   }
} 

exports.getMovie = async(req, res)=>{
    try{
        const movie = await Movie.findById(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })
    }catch(error){
    res.status(400).json({
        status: "fail",
        message: error.message
    });
   }
}

exports.createMovie = async(req,res)=>{
    try{
        const movie =await Movie.create(req.body);
        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })
    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err.message
        })
    }
}

exports.updateMovie = async(req, res)=>{
    try{
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {new: true, runValidators: true});
        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })
    }catch(error){
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
}

exports.deleteMovie = async(req, res)=>{
    try{
        const movie = await Movie.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "success",
            data: {
                movie
            }
        })
    }catch(error){
        res.status(400).json({
            status: "fail",
            message: error.message
        })
    }
  
}
