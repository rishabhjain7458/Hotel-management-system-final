const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({

    name:{
        type : String,
        required:[true, 'Please enter your name.']
    },
    email:{
        type:String,
        required:[true,'Please enter an email.'],
        unique: true,
        lowercase:true,
        validate: [validator.isEmail,"Please enter a valid email."]
    },

    password:{
       type:String,
       required:[true,'Please enter a Password'],
       minlength:8 
    },
    confirmPassword:{
        type:String,
        required:[true,'Please confirm your Password'],
        validate:{
            validator : function(val){
                return val== this.password;
            },
            message:"Password $ Confirm Password does not match!"
        }
     }
    
})

const bcrypt = require('bcrypt');
userSchema.pre('save',async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password,12);
    this.confirmPassword = undefined;
    next();
})


//making a method to verify DB passaword and user given Password
//bcrypt.compare()

userSchema.methods.comparePasswordInDb=async function(pass,pwsDB){
    return bcrypt.compare(pass,pwsDB)
}



//creating model
const User = mongoose.model('User',userSchema);
module.exports = User ;