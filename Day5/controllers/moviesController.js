
const fs = require('fs');
let movies = JSON.parse(fs.readFileSync("./movies.json",'utf-8'));

//Creating param middleware to check if the mocie with given id exists?
exports.checkId = (req, res, next, value) => {
    console.log("Movie Id id "+value);
    id = parseInt(value);
    let movie = movies.find(elem => elem.id === id) //returns the element of that array which matches to the condition..
    console.log(movie)
    if(!movie){
       return res.status(404).json({
            status: "fail",
            message: "Movie with id "+id+" is not found"
        });
    }
    next();
}

//ROUTE HANDLER
exports.getAllMovie = (req,res)=>{ 
    //Using JSON JSON formatting to send the json data
    res.status(200).json({
        status: "success",
        count: movies.length,
        data: {
            movies: movies
        }
    });
}

exports.getMovie = (req, res)=>{
    let id = req.params.id * 1; //Multiplying by 1 converts string in numeric value
    //Find movie based on id parameter...
    let movie = movies.find(elem => elem.id === id) //returns the element of that array which matches to the condition..
    // if(!movie){
    //    return res.status(404).json({
    //         status: "fail",
    //         message: "Movie with id "+id+" is not found"
    //     });
    // }
    res.status(200).json({
        status: "success",
        data: {
             movie: movie
        }
    });  
}

exports.createMovie = (req,res)=>{
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

exports.updateMovie = (req, res)=>{
    let id = req.params.id*1; //Converting into numeric value
    let movieToUpdate = movies.find(elem => elem.id===id);
    // if(!movieToUpdate){
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Sorry, the movie with id "+id+" deosn't exist"
    //     });
    // }
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

exports.deleteMovie = (req, res)=>{
    let id = req.params.id*1; //converting into numeric value
    let movieTodelete = movies.find(elem => elem.id === id);
    // if(!movieTodelete){
    //     return res.status(404).json({
    //         status: "fail",
    //         message: "Sorry, the movie with id "+id+" not found"
    //     });
    // }
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
