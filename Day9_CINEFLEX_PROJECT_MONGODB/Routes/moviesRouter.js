
const express = require('express');
const moviesController = require("../controllers/moviesController");
const authController = require("./../controllers/authController");

const router= express.Router(); //Creating a new router

router.route("/get-highest").get(moviesController.getHighestRated,moviesController.getAllMovie)//Aliasing a route

//Below two routes are for learing aggregate pipeline in mongodb...
router.route("/movie-stats").get(moviesController.getMovieStat);
router.route("/movie-by-genre/:genre").get(moviesController.getMovieByGenre);

router.route("/")
    .get(authController.protect, moviesController.getAllMovie)
    .post(moviesController.createMovie) 
    //middleware chaining...first validation middleware is run and then createMovie middleware function is run.

router.route("/:id")
    .get(authController.protect, moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(authController.protect, authController.restrict('admin'), moviesController.deleteMovie) //delete functionality is only given to admin, so restricting for user..

module.exports = router