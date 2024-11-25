const express = require('express');

const bookingRouter = express.Router();

const roomMiddleware = require("./../Middlewares/roomMiddleware.js")

const bookingControllers = require("./../Controllers/bookingController.js")

bookingRouter.route("/")
.get(bookingControllers.getbookings)
.delete(bookingControllers.deleteAllBookings)
.post(roomMiddleware.checkRoomAvailability,bookingControllers.bookRoom)

bookingRouter.route("/:id")
.delete(bookingControllers.deleteBooking)

module.exports = bookingRouter;