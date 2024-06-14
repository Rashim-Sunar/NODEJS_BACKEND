const Movie = require("../models/movieModel");

//ROUTE HANDLER
exports.getAllMovie = async(req,res)=>{ 
   try{

      //Filtering the movies from string query...
      //For eg. 127.0.0.1:3000/api/v1/movies/?duration=90&rating=4.5 , in this url after '?' duation and ratings are query strings..
    //   console.log(req.query);
      const movies = await Movie.find(req.query);

    //Filtering movies by using mongoose filtering method
    /*const movies = await Movie.find()
            .where("duration").equals(req.query.duration)
            .where("rating").equals(req.query.rating);
    */

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
