const express = require("express");
const app = express();
const fs = require('fs');
const port = 3000;

let movies = JSON.parse(fs.readFileSync("./movies.json",'utf-8'));

app.use(express.json())//This is called middleware because it stands in middle of request and response...

app.get("/api/v1/movies",(req,res)=>{ 
    //Using JSON JSON formatting to send the json data
    res.status(200).json({
        status: "success",
        count: movies.length,
        data: {
            movies: movies
        }
    });
});

//Express route parameters*****************
/*Route parameters are named URL segments that are used to capture the values specified at their position in the URL.
 The captured values are populated in the req. params object, with the name of the route parameter specified 
 in the path as their respective keys. For eg: 127.0.0.1:3000/api/v1/movies/:id,  here :id->is a reoute parameter*/
 
//  app.get("/api/v1/movies/:id/:name?/:x?",(req,res)=>{
//     // "?" make a param optional i.e if it is not typed in url also you won't get any error..
//     console.log(req.params); //req.params returns a object whose values are string...
//     res.send("route parameters logged");
//  })

app.get("/api/v1/movies/:id",(req, res)=>{
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
});


//POST method is for creating a new resource....
app.post("/api/v1/movies",(req,res)=>{
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
})

app.listen(port,()=>{
    console.log("Server has started on port",port)
});