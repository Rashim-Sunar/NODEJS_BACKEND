const User = require('../models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const customError = require("./../Utils/customError");
const util = require('util')

const signToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_STR, {
        expiresIn: process.env.EXPIRING_DAY
    })
}

//route handler middleware...
exports.signup = asyncErrorHandler(async(req, res, next)=>{
        const newUser = await User.create(req.body);

        //When new user is created, sending webtoken to the user in response so that s/he can directly be loggedIn
        // const token = jwt.sign({id: newUser._id}, process.env.SECRET_STR, {
        //     expiresIn: process.env.EXPIRING_DAY
        // })

        const token = signToken(newUser._id);

        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: newUser
            }
        })
});

//Signin a user means to sign a json web token and send it back to the user...
exports.login = asyncErrorHandler(async(req, res, next)=>{
    const email = req.body.email;
    const password = req.body.password;

    if(!email ||!password){
        const err = new customError("Please provide email ID and password for login!", 400);
        return next(err);
    }

    const user = await User.findOne({email}).select("+password"); //.select("+password") helps to get the password field also though it is unselected in userSchema..
    //The 'user' above is an instance of userModel and basically it is going to store User document. So, we can call instance method( .comparePasswordInDb) on 'user0.' 
    // const isMatch = await user.comparePasswordInDB(password, user.password);

    //Check is user exists and password matches...
    if(!user || !(await user.comparePasswordInDB(password, user.password))){
        const err = new customError("Incorrect email or password!", 400);
        return next(err);
    }

    const token = signToken(user._id);

    res.status(200).json({
        status: "success",
        token
    });
});


//PROTECTING ROUTES -- Middleware to verify token from user...
exports.protect = asyncErrorHandler(async(req, res, next)=>{
    //1.Read the token and check if it exists
    const testToken = req.headers.authorization;
    let token;
    if(testToken && testToken.startsWith('Bearer')){
        token = testToken.split(" ")[1];
    }
    if(!token){
        next(new customError("You are not logged in. Please login first", 401));
    }

    //2. Validate the token.
    const decodedToken = await util.promisify(jwt.verify)(token, process.env.SECRET_STR);
    console.log(decodedToken);

    //3.If the user exists.
    const user = await User.findById(decodedToken.id);
    if(!user){
        const err = new customError('The user with the given token does not exist.', 401);
        next(err);
    }

    //4.If the user chnaged password after the token was issued
    const isChanged = await user.isPasswordChanged(decodedToken.iat);
    if(isChanged){
        const err = new customError("Password is changed recently. Please login again!", 401);
        next(err);
    }

    //5. Allow user to accessf routes
    req.user = user; //Attach the currently loggedin user along with req object so that it can be used for strict function below..
    next();
});

//Wrapper function for verifying if client can delete a movie. Only admin can delete the movie. In middleware function, we can only pass req, res, and next as arguement.
//That's why we are creating a wrapper function which can take any arguement and then, inside wrapper, we are introducing a middleware function..
exports.restrict = (role) => {
    return (req, res, next)=>{
        if(req.user.role !== role){
            const err = new customError("You do not have access to perform this action", 403);
            next(err);
        }

        next();
    }
}


exports.forgotPassword = asyncErrorHandler(async(req, res, next) => {
    //1.GET THE USER BASED ON POSTED EMAIL
        const user = await User.findOne({email: req.body.email});
        if(!user){
            const err = new customError("We could not find the user with given email address!", 404);
            next(err);
        }

    //2. GENERATE A RANDOM TOKEN
    const resetToken = await user.createRestPasswordToken(); 
    await user.save({validateBeforeSave: false});
    //3. SEND THE TOKEN BACK TO THE USER EMAIL
});

exports.resetPassword = asyncErrorHandler(async(req, res, next) => {

});