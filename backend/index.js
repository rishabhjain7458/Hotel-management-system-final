const express = require('express');
const app = express();
const cors = require('cors');

const mongoose = require('mongoose');
const roomRouter = require('./Routes/roomsRouter');
const bookingRouter = require('./Routes/bookingRouter');
const eventRouter = require('./Routes/eventRouter');
const authRouter = require('./Routes/authRouter');
const path = require('path');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



mongoose.connect("mongodb+srv://admin:hellow9rld@mydb.efzewbx.mongodb.net/hotelTaj?retryWrites=true&w=majority&appName=myDB")
  .then((conn) => {
    console.log("DB Connection successful");
  })
  .catch((err) => {
    console.log("Some error has occurred", err);
  });
app.use(cors());
app.use(express.json());

// Use the correct path for authRouter
app.use("/users", authRouter);

app.use("/rooms", roomRouter);
app.use("/bookings", bookingRouter);
app.use("/events",eventRouter);
module.exports = app;
