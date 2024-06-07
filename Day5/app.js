const express = require("express");
const app = express();
const fs = require('fs');
const port = 3000;

let movies = JSON.parse(fs.readFileSync("./movies.json",'utf-8'));

app.use(express.json())//This is called middleware because it stands in middle of request and response...


//ROUTE HANDLER
const getAllMovie = (req,res)=>{ 
    //Using JSON JSON formatting to send the json data
    res.status(200).json({
        status: "success",
        count: movies.length,
        data: {
            movies: movies
        }
    });
}

const getMovie = (req, res)=>{
    let id = req.params.id * 1; //Multiplying by 1 converts string in numeric value
    //Find movie based on id parameter...
    let movie = movies.find(elem => elem.id === id) //returns the element of that array which matches to the condition..
    if(!movie){
        res.status(404).json({
            status: "fail",
            message: "Movie with id "+id+" is not found"
        });
    }else{
        res.status(200).json({
            status: "success",
            data: {
                movie: movie
            }
        });
    }
}

const createMovie = (req,res)=>{
    //Without middleware the request body is not attached to req...
    //To attach body to request, we need to use a middleware...app.use(express.json())
    // console.log(req.body); 
    // res.end("Movie created");
    const newId = movies[movies.length - 1].id + 1;
    let newObject = Object.assign({id: newId}, req.body) //reutrns a new object by merging existing two objects
    movies.push(newObject);
    fs.writeFile("./movies.json",JSON.stringify(movies),(err)=>{
        if(err){
            console.warn("Error creating a new movie");
            return;
        }
        //Status code 201 is for creating a new resource....
        res.status(201).json({
            status: "success",
            data: {
                movie: newObject
            }
        });
    }) 
}

const updateMovie = (req, res)=>{
    let id = req.params.id*1; //Converting into numeric value
    let movieToUpdate = movies.find(elem => elem.id===id);
    if(!movieToUpdate){
        res.status(404).json({
            status: "fail",
            message: "Sorry, the movie with id "+id+" deosn't exist"
        });
    }else{
        let index = movies.indexOf(movieToUpdate);
        let movie = Object.assign(movieToUpdate, req.body); //if name only sent in request then the name content of the resource is only overwritten and other are returned original
        movies[index] = movie;
        fs.writeFile("./movies.json", JSON.stringify(movies),(err)=>{
            if(err){
                console.log("Error updating the movie");
            }else{
                res.status(200).json({
                    status: "success",
                    data: {
                        movie: movie
                    }
                });
            }
        }) 
    }
}

const deleteMovie = (req, res)=>{
    let id = req.params.id*1; //converting into numeric value
    let movieTodelete = movies.find(elem => elem.id === id);
    if(!movieTodelete){
        res.status(404).json({
            status: "fail",
            message: "Sorry, the movie with id "+id+" not found"
        });
    }else{
        let index = movies.indexOf(movieTodelete);
        movies.splice(index, 1);
        fs.writeFile("./movies.json", JSON.stringify(movies),(err)=>{
            if(err){
                console.log("Error deleting a movie");
            }else{
                res.status(200).json({
                    status: "success",
                    data: {
                        movie: movieTodelete
                    }
                });
            }
        });
        
    }
}


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
const movieRouter = express.Router(); //Creating a new router
movieRouter.route("/")
    .get(getAllMovie)
    .post(createMovie)

movieRouter.route("/:id")
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)

app.use("/api/v1/movies",movieRouter); // Mounting router 'movieRouter' to the given path.
//When we mount a router to a path, then it becomes a middleware adn is applied to all the requests which contain that path as endpoint.

app.listen(port,()=>{
    console.log("Server has started on port",port)
});
