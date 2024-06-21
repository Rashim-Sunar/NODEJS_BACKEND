const mongoose = require('mongoose');
const validator = require('validator');

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
        required: [true, "Please confirm your password."]
    }
});

const User = mongoose.model('user', userSchema);

module.exports = User;