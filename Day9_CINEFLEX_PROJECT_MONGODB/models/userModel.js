const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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
    photo: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, "Enter your password"],
        minlength: 5,
        select: false //means that it is not returned in response
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
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetTokenExpires: Date
});

//Mongoose document middleware for encrypting password before it is saved..(after chnaging the current user passoword too)
userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next(); //if password not changed, no need of encryption again
    //else..hashing the password before it is saved..

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined; //not storing confirmPassword in database(only for validation purpose)
    next();
});

//Creating a function to compare the password which we are receing in the body with the password that is saved in database.
//Creating a instance method -> A instance method is available to all the documents of a collection. i.e. to all the instance of userModel(this file).
userSchema.methods.comparePasswordInDB = async function(pswd, pswdDB){
    return bcrypt.compare(pswd, pswdDB);
}

userSchema.methods.isPasswordChanged = async function(JWTTimeStamp){
    if(this.passwordChangedAt){
        // console.log(this.passwordChangedAt, JWTTimeStamp);
        const pswdChangedTimeStamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10); //Converting data to seconds
        return JWTTimeStamp < pswdChangedTimeStamp;
    }
    return false;
}

userSchema.methods.createRestPasswordToken = function(){
    const resetToken = crypto.randomBytes(32).toString('hex'); //resetToken here will be a plain token(not encrypted).

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetTokenExpires = Date.now() + 10*60*1000; //Expires in 10 min
    console.log(resetToken, this.passwordResetToken, this.passwordResetTokenExpires); //these two fields are not yet saved in the database, so we need to save it which is done in respective function

    return resetToken;
    //Here, we return plain token to the user but stores the encrypted token in database so that attackers if get control to database can perform the password reset functionality
    // When user send this token back, then we compare this plain token to the encrypted token in the database
}

const User = mongoose.model('user', userSchema);

module.exports = User;