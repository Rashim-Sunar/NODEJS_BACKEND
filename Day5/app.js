const express = require("express");
const app = express();

const moviesRouter = require('./Routes/moviesRouter');

app.use(express.json())//This is called middleware because it stands in middle of request and response...



// app.get("/api/v1/movies", getAllMovie);

// //Express route parameters*****************
// /*Route parameters are named URL segments that are used to capture the values specified at their position in the URL.
//  The captured values are populated in the req. params object, with the name of the route parameter specified 
//  in the path as their respective keys. For eg: 127.0.0.1:3000/api/v1/movies/:id,  here :id->is a reoute parameter*/
 
// //  app.get("/api/v1/movies/:id/:name?/:x?",(req,res)=>{
// //     // "?" make a param optional i.e if it is not typed in url also you won't get any error..
// //     console.log(req.params); //req.params returns a object whose values are string...
// //     res.send("route parameters logged");
// //  })

// app.get("/api/v1/movies/:id",getMovie);


// //POST method is for creating a new resource....
// app.post("/api/v1/movies", createMovie);

// //PUT & PATCH method to update the resource
// app.patch("/api/v1/movies/:id", updateMovie);

// //DELETE method to delete a resource by id........
// app.delete("/api/v1/movies/:id", deleteMovie);

//Since, some of the API's are having same endpoints, so refactoring the code using route chaining in express..
/*app.route("/api/v1/movies")
    .get(getAllMovie)
    .post(createMovie)

app.route("/api/v1/movies/:id")
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)
*/

app.use("/api/v1/movies",moviesRouter); // Mounting router 'movieRouter' to the given path.
//When we mount a router to a path, then it becomes a middleware adn is applied to all the requests which contain that path as endpoint.

module.exports = app;
