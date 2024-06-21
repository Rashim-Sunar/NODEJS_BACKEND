const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
        minlength: [3, "Name must contain at least 3 characters"]
    },
    email: {
        type: String,
        required: [true, "Enter your email!"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Enter your password"],
        minlength: 5
    },

    confirmPassword: {
        type: String,
        required: [true, "Please confirm your password."],
        //custom validator.. This validator only works for .save() & .create() method.
        validate: {
            validator: function(val){
                return val===this.password;
            },
            message: "Password and confirm passoword doesn't match!"
        }
    }
});

//Mongoose document middleware for encrypting password before it is saved..(after chnaging the current user passoword too)
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next(); //if password not changed, no need of encryption again
    //else..hashing the password before it is saved..

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined; //not storing confirmPassword in database(only for validation purpose)
    next();
})

const User = mongoose.model('user', userSchema);

module.exports = User;