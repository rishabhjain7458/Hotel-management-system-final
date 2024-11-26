const express = require("express");
const cron = require("node-cron"); // Import node-cron
const app = express();
const Rooms = require("./../Models/roomsModel.js");
const Bookings = require("../Models/bookingsModel.js");
const mongoose = require("mongoose");

// Helper function to check if the booking has expired
const isBookingExpired = (checkoutDate) => {
  return new Date(checkoutDate) < new Date();
};
// Automatically delete expired bookings every hour
cron.schedule('0 * * * *', async () => {  // Runs every hour at the start of the hour
  try {
    // Find all expired bookings
    const expiredBookings = await Bookings.find({
      checkoutDate: { $lt: new Date() }, // Find bookings where the checkout date is in the past
    });

    // Update rooms associated with expired bookings
    for (const booking of expiredBookings) {
      await Rooms.findOneAndUpdate(
        { name: booking.roomBooked }, // Match the room associated with the booking
        { $set: { readyForCheckIn: true } } // Mark it as ready for check-in
      );
    }

    // Delete all expired bookings
    const result = await Bookings.deleteMany({
      checkoutDate: { $lt: new Date() },
    });

    console.log(`Deleted ${result.deletedCount} expired bookings and updated associated rooms.`);
  } catch (err) {
    console.error('Error deleting expired bookings or updating rooms:', err);
  }
});


// Get all bookings
exports.getbookings = async (req, res) => {
  try {
    let bookings = await Bookings.find();
    
    // Optionally filter expired bookings from the response
    bookings = bookings.filter(booking => !isBookingExpired(booking.checkoutDate));
    
    res.status(200).json({
      status: "success",
      data: {
        bookings: bookings,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

// Book a room
exports.bookRoom = async (req, res) => {
  try {
    // Create the booking
    const booking = await Bookings.create(req.body);

    // Update the room's availability status to false
    const room = await Rooms.findOneAndUpdate(
      { name: req.body.roomBooked, readyForCheckIn: true }, // Find the room booked and ensure it's available
      { $set: { readyForCheckIn: false } }, // Set it as not ready for check-in
      { new: true } // Return the updated room document
    );

    if (!room) {
      // If no room was found or it wasn't ready for check-in, delete the created booking
      await Bookings.findByIdAndDelete(booking._id);
      return res.status(400).json({
        status: "fail",
        message: "Room is not available for booking",
      });
    }

    res.status(201).json({
      status: "success",
      data: {
        booking: booking,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.deleteBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid ID format",
      });
    }

    // Find the booking by ID
    const booking = await Bookings.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "No booking found with that ID",
      });
    }

    // Update the associated room to be ready for check-in
    const room = await Rooms.findOneAndUpdate(
      { name: booking.roomBooked },
      { $set: { readyForCheckIn: true } },
      { new: true }
    );

    if (!room) {
      return res.status(404).json({
        status: "fail",
        message: "Associated room not found.",
      });
    }

    // Delete the booking
    await Bookings.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};


// Delete all bookings and update all associated rooms
exports.deleteAllBookings = async (req, res) => {
  try {
    // Fetch all bookings
    const allBookings = await Bookings.find();

    // Update all rooms associated with the bookings to set readyForCheckIn to true
    for (const booking of allBookings) {
      await Rooms.findOneAndUpdate(
        { name: booking.roomBooked }, // Find the room associated with the booking
        { $set: { readyForCheckIn: true } }, // Mark it as ready for check-in
        { new: true }
      );
    }

    // Delete all bookings
    const result = await Bookings.deleteMany({});

    res.status(204).json({
      status: "success",
      message: `Deleted all bookings and updated associated rooms.`,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

