const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path:"./config.env"}); // to connect config
const fs = require("fs");


const roomSchema = new mongoose.Schema({
    name:{
        type: String,
        required:[true,'Name is a required field!'],
        unique: true,
    },
    price:{
        type: Number,
        required:[true,'Price is a required field']
    },
    occupancy:{
        type: Number,
        required:[true,'Occupancy is a required field']
    },
    amenityFeature:{
        type: String
    },
    telephone:{
        type: String
    },
    readyForCheckIn:{
        type: Boolean,
        default:true
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
}
)

const Rooms=mongoose.model("rooms",roomSchema);


module.exports = Rooms;