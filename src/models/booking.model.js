const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  ticketId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bus',
    required: true
  },
  timeSlot: {
    type: Date,
    required: true
  },
  seatsBooked: {
    type: Number,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'cancelled'],
    default: 'confirmed'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
