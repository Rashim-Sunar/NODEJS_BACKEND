const User = require('../models/userModel');
const asyncErrorHandler = require('./../Utils/asyncErrorHandler');
const jwt = require('jsonwebtoken');
const customError = require("./../Utils/customError");
const util = require('util')
const sendEmail = require('./../Utils/email');
const crypto = require('crypto');

const signToken = (id) => {
    return jwt.sign({id}, process.env.SECRET_STR, {
        expiresIn: process.env.EXPIRING_DAY
    })
}


const filterReqObj = (obj, ...allowFields) => {
    const newObj = {};
    Object.keys(obj).forEach(prop => {
        if(allowFields.includes(prop)){
            newObj[prop] = obj[prop];
        }
    });

    return newObj;
}

//A signed in user can change(update) the password whenever s/he wants. This is the main difference between password reset and password update...
exports.updatePassword = asyncErrorHandler(async(req, res, next)=>{
    //Though user is currently loggedin, s/he needs to send the current passoword with req in order to confirm the user is actually authorized..
    
    //1. GET CURRENT USER DATA FROM THE DATABASE...
    const user = await User.findById(req.user._id).select('+password');
    //2. CHECK IF THE SUPPLIED CURRENT PASSWORD IS CORRECT...
    if(!(await user.comparePasswordInDB(req.body.currentPassword, user.password))){
        const err = new customError("The password you provided is wrong", 401);
        return next(err);
    }
    //3.IF SUPPLIED PASSWORD IS CORRRECT, UPDATE USER PASSWORD WITH NEW VALUE
    user.password = req.body.password;
    user.confirmPassword = req.body.confirmPassword;
    await user.save();

    //4. LOGIN USER & SEND JWT(Json WebToken)...
    const token = signToken(user._id);
    res.status(200).json({
        status: "success",
        token,
        data: {
            user
        }
    });
    //createSendResponse(user, 200, res);
}); 


//Any loggedin user can update his own details like(changiAnishang name).
exports.updateMe = asyncErrorHandler(async(req, res, next) => {
    //We can't use this endpoint to update the users password. For this we have separate endpoint as above.
    if(req.body.password || req.body.confirmPassword){
        const err = new customError("We can not use this endpoint to update the password!", 400);
        return next(err);
    }


    // UPDATE USER DETAILS...
    const filterObj = filterReqObj(req.body, 'name','email'); //including only name and email to update
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filterObj, {runValidators: true, new: true})

    res.status(200).json({
        status: "success",
        message: "User updated successfully",
        data: {
            user: updatedUser
        }
    });    
});

//Loggedin user can delete(soft delete--> only set as inactive in database)...
exports.deleteMe = asyncErrorHandler(async(req, res, next) => {
    await User.findByIdAndUpdate(req.user._id, {active: false});

    res.status(204).json({
        status: "success",
        data: null
    });
});