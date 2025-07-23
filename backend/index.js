const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");

// Import Routers
const roomRouter = require("./Routes/roomsRouter");
const bookingRouter = require("./Routes/bookingRouter");
const eventRouter = require("./Routes/eventRouter");
const authRouter = require("./Routes/authRouter");

// --- CORE MIDDLEWARE SETUP ---

// 1. Explicitly handle preflight (OPTIONS) requests.
// This is a robust way to ensure the browser's security check passes.
app.options("*", cors()); // This enables pre-flight across-the-board.

// 2. Main CORS Configuration
// This allows your frontend to make requests to this backend.
app.use(cors());

// 3. Body Parser for JSON
app.use(express.json());

// 4. Serve static files from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- DATABASE CONNECTION ---
mongoose
  .connect(process.env.CONN_STR)
  .then(() => {
    console.log("DB Connection successful");
  })
  .catch((err) => {
    console.log("Some error has occurred", err);
  });

// --- API ROUTES ---
// All API routes are defined AFTER the core middleware.
app.use("/users", authRouter);
app.use("/rooms", roomRouter);
app.use("/bookings", bookingRouter);
app.use("/events", eventRouter);

// --- EXPORT THE APP ---
module.exports = app;
