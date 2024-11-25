const express = require('express');
const eventRouter = express.Router();
const eventController = require('./../Controllers/eventContoller');

eventRouter.route("/")
    .get(eventController.getEvents)
    .delete(eventController.deleteAllEvents)
    .post(eventController.bookEvent);

eventRouter.route("/:id")
    .delete(eventController.deleteEvent);

eventRouter.route("/try")
    .post(eventController.createEvent);
module.exports = eventRouter;