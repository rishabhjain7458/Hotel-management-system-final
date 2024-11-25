const express = require('express');
const roomRouter = express.Router();
const roomControllers = require("./../Controllers/roomsController");

roomRouter.route("/")
    .get(roomControllers.getFilteredRooms)  // Updated this line
    .post(roomControllers.createRoom)
    .delete(roomControllers.deleteAllRooms);

roomRouter.route("/:id")
    .get(roomControllers.getRoomById)  // Added for getting a single room
    .delete(roomControllers.deleteRoom);

module.exports = roomRouter;
