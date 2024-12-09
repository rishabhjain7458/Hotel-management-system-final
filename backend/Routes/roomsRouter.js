const express = require('express');
const roomRouter = express.Router();
const roomControllers = require("./../Controllers/roomsController");

roomRouter.route("/")
    .get(roomControllers.getFilteredRooms)
    .post(roomControllers.uploadRoomImage, roomControllers.createRoom) // Added upload middleware
    .delete(roomControllers.deleteAllRooms);

roomRouter.route("/:id")
    .get(roomControllers.getRoomById)
    .delete(roomControllers.deleteRoom)
    .patch(roomControllers.uploadRoomImage, roomControllers.updateRoom); // Added upload middleware

module.exports = roomRouter;
