// models/Event.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  hall: {
    type: String,
    required: true,
  },
  date: {
    type: Date, // Make sure "Date" is capitalized
    required: true,
  },
  paidFor: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model('Event', eventSchema);
