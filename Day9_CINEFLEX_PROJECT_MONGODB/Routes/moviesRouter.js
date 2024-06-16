
const express = require('express');
const moviesController = require("../controllers/moviesController");

const router= express.Router(); //Creating a new router

router.route("/get-highest").get(moviesController.getHighestRated,moviesController.getAllMovie)//Aliasing a route

router.route("/movie-stats").get(moviesController.getMovieStat);

router.route("/")
    .get(moviesController.getAllMovie)
    .post(moviesController.createMovie) 
    //middleware chaining...first validation middleware is run and then createMovie middleware function is run.

router.route("/:id")
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports = router