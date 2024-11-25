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
    // Delete all expired bookings
    const result = await Bookings.deleteMany({
      checkoutDate: { $lt: new Date() }, // Find bookings where the checkout date is in the past
    });

    console.log(`Deleted ${result.deletedCount} expired bookings.`);
  } catch (err) {
    console.error('Error deleting expired bookings:', err);
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

    // Update the room's availability status
    const testbooking = await Rooms.findOneAndUpdate(
      { name: req.body.roomBooked, readyForCheckIn: false },
      { $set: { readyForCheckIn: true } }
    );

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

// Delete a booking manually (if needed)
exports.deleteBooking = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid ID format",
      });
    }

    // Find and delete the booking by ID
    const booking = await Bookings.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({
        status: "fail",
        message: "No booking found with that ID",
      });
    }

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

// Delete all expired bookings manually (for testing or admin use)
exports.deleteAllBookings = async (req, res) => {
  try {
    // Delete all expired bookings
    const result = await Bookings.deleteMany({
      checkoutDate: { $lt: new Date() },
    });

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
