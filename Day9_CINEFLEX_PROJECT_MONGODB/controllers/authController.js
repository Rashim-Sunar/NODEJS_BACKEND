const User = require('../models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const customError = require("./../Utils/customError");

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