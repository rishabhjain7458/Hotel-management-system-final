const express = require("express");
const Rooms = require('./../Models/roomsModel');
const apiFeatures = require('./../utils/apiFeatures');

// Get all rooms with optional filtering, sorting, and pagination
exports.getFilteredRooms = async (req, res) => {
    try {
        // Initialize API features with the query and request parameters
        const features = new apiFeatures(Rooms.find(), req.query)
            .filter()
            .sort()
            .limit_fields()
            .pagination();

        // Add default sorting by name if no sort query is provided
        if (!req.query.sort) {
            features.query = features.query.sort('name'); // Default to sorting by name
        }

        // Execute the query
        const rooms = await features.query;

        res.status(200).json({
            status: 'success',
            results: rooms.length,
            data: {
                rooms
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `Error fetching rooms: ${err.message}`
        });
    }
};

// Get a single room by ID
exports.getRoomById = async (req, res) => {
    try {
        const room = await Rooms.findById(req.params.id);

        if (!room) {
            return res.status(404).json({
                status: 'fail',
                message: 'No room found with the specified ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                room
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `Error fetching room: ${err.message}`
        });
    }
};

// Create a new room
exports.createRoom = async (req, res) => {
    try {
        const room = await Rooms.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                room
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `Error creating room: ${err.message}`
        });
    }
};

// Update a room by ID
exports.updateRoom = async (req, res) => {
    try {
        const room = await Rooms.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true // Run schema validators on update
        });

        if (!room) {
            return res.status(404).json({
                status: 'fail',
                message: 'No room found with the specified ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                room
            }
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

// Update a room by ID
exports.updateRoom = async (req, res) => {
    try {
        // Validate if there is any update in the request body
        if (Object.keys(req.body).length === 0) {
            return res.status(400).json({
                status: 'fail',
                message: 'No data provided to update the room',
            });
        }

        // Find the room by ID and update its details
        const room = await Rooms.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure validation rules are followed
        });

        if (!room) {
            return res.status(404).json({
                status: 'fail',
                message: 'No room found with the specified ID',
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Room details updated successfully',
            data: {
                room,
            },
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: `Error updating room: ${err.message}`,
        });
    }
};

