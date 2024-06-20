const customError = require("../Utils/customError");

//Development errors are visible to the developer
const devError = (res, error) => {
    res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
        stackTrace: error.stack,
        error: error
    });
}

//Production error are visible to the users..
const productionError = (res, error) => {
    //Only opertional errors are returned to the user but not the internal server error.
    if(error.isOperational){
        res.status(error.statusCode).json({
            status: error.status,
            message: error.message
        });
    }else{  //else (non-operational errror)server error has occured, so send server error.
        res.status(500).json({
            status: "error",
            message: "Seems like something went wrong. Please try later!"
        }); 
    }
}

//castError handler
const castErrorHandler = (err) => {
    const msg = `Invalid value for ${err.path}: ${err.value} !`;
    return new customError(msg, 400);
}

module.exports = (error, req, res, next)=>{
    error.statusCode = error.statusCode || 500; //500 is for internal server error..
    error.status = error.status || 'error';

    if(process.env.NODE_ENV === 'development'){
        devError(res, error);
    }else if(process.env.NODE_ENV === 'production'){
       if(error.name === "CastError"){
        //Handling invalid id error
         error = castErrorHandler(error);
       }
       productionError(res, error);
    }
}