const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  busNumber: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: Date,
    required: true,
  },
  seatsBooked: {
    type: Number,
    
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
