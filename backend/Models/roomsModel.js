const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: "./config.env" }); // to connect config
const fs = require("fs");

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    occupancy: {
        type: Number,
        required: true,
    },
    amenityFeature: {
        type: String,
        required: true,
    },
    telephone: {
        type: String,
        required: true,
    },
    readyForCheckIn: {
        type: Boolean,
        required: true,
    },
    image: {
        type: String, // This will store the path to the image
    },
});

const Rooms = mongoose.model('Rooms', roomSchema);


module.exports = Rooms;
