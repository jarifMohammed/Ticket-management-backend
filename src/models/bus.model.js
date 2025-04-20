const mongoose = require("mongoose");

// Schema for tickets in different time slots
const ticketSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  timeSlot: {
    type: Date,
    required: true,
  },
  availableSeats: {
    type: Number,
    required: true,
  },
  soldSeats: {
    type: Number,
    default: 0,
  },
  ticketPrice: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ["available", "booked", "cancelled"],
    default: "available",
  },
});

// Main Bus Schema
const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^[A-Z0-9]+$/,
    },
    busType: {
      type: String,
      required: true,
      enum: ["Sleeper", "Non-Sleeper", "AC", "Non-AC", "Semi-Sleeper"],
    },
    capacity: {
      type: Number,
      required: true,
      min: [10, "A bus must have at least 10 seats"],
    },
    route: {
      from: {
        type: String,
        required: true,
        trim: true,
      },
      to: {
        type: String,
        required: true,
        trim: true,
      },
      distanceKm: {
        type: Number,
        required: true,
        min: [1, "Distance must be at least 1 km"],
      },
    },

    departureTimes: [
      {
        type: Date,
        required: true,
      },
    ],

    tickets: {
      type: [ticketSchema],
      default: [],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

busSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

busSchema.index({ "route.from": 1, "route.to": 1, busType: 1 });

module.exports = mongoose.model("Bus", busSchema);
