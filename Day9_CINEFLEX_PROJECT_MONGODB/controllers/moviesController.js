const Movie = require("../models/movieModel");

//ROUTE HANDLER
exports.getAllMovie = async(req,res)=>{ 
   try{
      const movies = await Movie.find();
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
