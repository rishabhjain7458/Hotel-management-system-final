const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:"./config.env"}); // to connect config
const fs = require("fs");

const bookingSchema = new mongoose.Schema({
    bookedAt:{
        type:Date,
        required:[true,"This is a required field"]
    },
    roomBooked:{
        type: String,
        required:[true,"This is a required field"]
    },
    customerName:{
        type: String,
        required:[true,"This is a required field"]
    },
    checkoutDate:{
        type:Date,
        required:[true,"This is a required field"]
    },
    paymentStatus:{
        type: String,
        required:[true,"This is a required field"]
    }   
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}

)

const Bookings = mongoose.model("bookings",bookingSchema);

module.exports = Bookings;