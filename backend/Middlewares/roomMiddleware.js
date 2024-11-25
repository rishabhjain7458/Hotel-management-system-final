    const mongoose = require("mongoose");
    const Rooms = require("./../Models/roomsModel.js")

    exports.checkRoomAvailability = async (req, res, next) => {
        try {

            const room = await Rooms.findOne({ name: req.body.roomBooked });
            console.log(req.body.roomBooked);
            console.log(room);

            if (!room) {
                return res.status(404).json({
                    status: "fail",
                    message: "Room not found",
                });
            }

            if (room.readyForCheckIn === false) {
                return res.status(400).json({
                    status: "fail",
                    message: "Room is already booked",
                });
            }

            // Proceed to the next middleware
            next();
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: err.message,
            });
        }
    };
