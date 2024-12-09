const express = require("express");
const multer = require("multer");
const Rooms = require('./../Models/roomsModel');
const apiFeatures = require('./../utils/apiFeatures');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Folder to store uploaded images
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    },
});

const upload = multer({
    storage,    
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new Error('Not an image! Please upload only images.'), false);
        }
    },
});

// Middleware for handling image uploads
exports.uploadRoomImage = (req, res, next) => {
    upload.single('image')(req, res, (err) => {
        if (err) {
            console.error('Image upload error:', err.message);
            return res.status(400).json({
                status: 'fail',
                message: `Error uploading image: ${err.message}`
            });
        }
        console.log('File uploaded:', req.file);
        next();
    });
};


// Get all rooms with optional filtering, sorting, and pagination
exports.getFilteredRooms = async (req, res) => {
    try {
        const features = new apiFeatures(Rooms.find(), req.query)
            .filter()
            .sort()
            .limit_fields()
            .pagination();

        if (!req.query.sort) {
            features.query = features.query.sort('name'); // Default sorting by name
        }

        const rooms = await features.query;

        console.log('Rooms fetched:', rooms);
        res.status(200).json({
            status: 'success',
            results: rooms.length,
            data: { rooms }
        });
    } catch (err) {
        console.error('Error fetching rooms:', err.message);
        res.status(400).json({
            status: 'fail',
            message: `Error fetching rooms: ${err.message}`
        });
    }
};


// Get a single room by ID
exports.getRoomById = async (req, res) => {
    try {
        console.log('Fetching room with ID:', req.params.id);
        const room = await Rooms.findById(req.params.id);

        if (!room) {
            console.error('Room not found with ID:', req.params.id);
            return res.status(404).json({
                status: 'fail',
                message: 'No room found with the specified ID'
            });
        }

        console.log('Room data:', room);
        res.status(200).json({
            status: 'success',
            data: { room }
        });
    } catch (err) {
        console.error('Error fetching room:', err.message);
        res.status(400).json({
            status: 'fail',
            message: `Error fetching room: ${err.message}`
        });
    }
};


// Create a new room
exports.createRoom = async (req, res) => {
    try {
        const roomData = { ...req.body };
        if (req.file) {
            console.log('Uploaded file:', req.file); // Debug log to see file details
            roomData.image = req.file.path.replace('uploads/', ''); // Store relative path
        }

        const room = await Rooms.create(roomData);

        res.status(201).json({
            status: 'success',
            data: { room }
        });
    } catch (err) {
        console.error('Error creating room:', err); // Debug log
        res.status(400).json({
            status: 'fail',
            message: `Error creating room: ${err.message}`
        });
    }
};


// Update a room by ID
exports.updateRoom = async (req, res) => {
    try {
        const roomData = { ...req.body };

        // If a new image is uploaded, store the image path
        if (req.file) {
            roomData.image = req.file.path; // Save the new image path
        }

        // Find and update the room by its ID
        const room = await Rooms.findByIdAndUpdate(req.params.id, roomData, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        });

        if (!room) {
            return res.status(404).json({
                status: 'fail',
                message: 'No room found with the specified ID'
            });
        }

        // Send response with the updated room data
        res.status(200).json({
            status: 'success',
            data: { room }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `Error updating room: ${err.message}`
        });
    }
};


// Delete a room by ID
exports.deleteRoom = async (req, res) => {
    try {
        const room = await Rooms.findByIdAndDelete(req.params.id);

        if (!room) {
            return res.status(404).json({
                status: 'fail',
                message: 'No room found with the specified ID'
            });
        }

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `Error deleting room: ${err.message}`
        });
    }
};

// Delete all rooms
exports.deleteAllRooms = async (req, res) => {
    try {
        await Rooms.deleteMany({});
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `Error deleting all rooms: ${err.message}`
        });
    }
};
