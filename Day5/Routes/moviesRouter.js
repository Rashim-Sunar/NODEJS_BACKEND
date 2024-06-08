
const express = require('express');
const moviesController = require("../controllers/moviesController");

const router= express.Router(); //Creating a new router

//param middleware which is only executed is url contains id & value==id...
// router.param('id',(req, res, next, value)=>{
//     console.log("Movie ID is "+  value);
//     next();
// })

router.param('id', moviesController.checkId);

router.route("/")
    .get(moviesController.getAllMovie)
    .post(moviesController.createMovie)

router.route("/:id")
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(moviesController.deleteMovie)

module.exports = router