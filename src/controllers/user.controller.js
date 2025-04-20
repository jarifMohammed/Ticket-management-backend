const Bus = require("../models/bus.model");
const User = require("../models/user.model");
const Booking = require("../models/booking.model");
const { default: mongoose } = require("mongoose");

// GET /buses - Get all available buses
exports.getAllBuses = async (req, res) => {
  try {
    const buses = await Bus.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: buses.length,
      buses: buses.map((bus) => ({
        id: bus._id,
        busNumber: bus.busNumber,
        busType: bus.busType,
        capacity: bus.capacity,
        route: bus.route,
        departureTimes: bus.departureTimes,
        availableTickets: bus.tickets.length,
      })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch buses.",
      error: err.message,
    });
  }
};

exports.purchaseTicket = async (req, res) => {
  try {

    
    const { busNumber, timeSlot, seatsToPurchase,} = req.body;
    
    const userId = req.user && req.user._id
   



    const bus = await Bus.findOne({ busNumber }).exec();
    if (!bus)
      return res.status(404).json({ success: false, message: "Bus not found" });

    const ticket = bus.tickets.find(
      (t) => t.timeSlot.toISOString() === new Date(timeSlot).toISOString()
    );
    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "Time slot not found" });

    if (ticket.availableSeats < seatsToPurchase) {
      return res
        .status(400)
        .json({ success: false, message: "Not enough available seats" });
    }

    // Update ticket values
    ticket.availableSeats -= seatsToPurchase;
    ticket.soldSeats += seatsToPurchase;

    // Save updated bus data (tickets are subdocs)
    await bus.save();

    // Optionally calculate total price
    const totalPrice = ticket.ticketPrice * seatsToPurchase;

    const newBooking = new Booking({
      userId: new mongoose.Types.ObjectId(userId),
      busNumber: bus.busNumber,
      ticketId:ticket._id, // this is available because of `_id: { auto: true }`
      busId: bus._id,
      timeSlot:ticket.timeSlot,
      seatsBooked: seatsToPurchase,
      totalPrice,
      bookingStatus: "confirmed",
    });
    await newBooking.save();

    // Send response (but without creating a Booking record)
    res.status(200).json({
      success: true,
      message: "Ticket purchased successfully and saved to bookings)",
      remainingSeats: ticket.availableSeats,
      totalPrice,
      ticketDetails: {
        timeSlot: ticket.timeSlot,
        seatsBooked: seatsToPurchase,
        ticketPrice: ticket.ticketPrice,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /tickets - View available tickets for specific buses and time periods
exports.getAvailableTickets = async (req, res) => {
  try {
    // Extract query parameters (busNumber, startTime, endTime)
    const { busNumber, startTime, endTime } = req.query;

    // Step 1: Validate the required parameters
    if (!busNumber) {
      return res.status(400).json({
        success: false,
        message: "Bus number is required",
      });
    }

    // Step 2: Find the bus by bus number
    const bus = await Bus.findOne({ busNumber }).exec();
    if (!bus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    // Step 3: Filter tickets based on the time period
    let availableTickets = bus.tickets;

    if (startTime && endTime) {
      // Convert the startTime and endTime to Date objects
      const startDate = new Date(startTime);
      const endDate = new Date(endTime);

      // Filter tickets that fall within the provided time period
      availableTickets = availableTickets.filter((ticket) => {
        const ticketTime = new Date(ticket.timeSlot);
        return ticketTime >= startDate && ticketTime <= endDate;
      });
    }

    // Step 4: Respond with the filtered available tickets
    res.status(200).json({
      success: true,
      totalTickets: availableTickets.length,
      tickets: availableTickets.map((ticket) => ({
        timeSlot: ticket.timeSlot,
        availableSeats: ticket.availableSeats,
        soldSeats: ticket.soldSeats,
        ticketPrice: ticket.ticketPrice,
      })),
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch available tickets",
      error: err.message,
    });
  }
};

exports.cancelTicket = async (req, res) => {
  try {
    const { busNumber, timeSlot, seatsToCancel } = req.body;

    const bus = await Bus.findOne({ busNumber }).exec();
    if (!bus)
      return res.status(404).json({ success: false, message: "Bus not found" });

    const ticket = bus.tickets.find(
      (t) => t.timeSlot.toISOString() === new Date(timeSlot).toISOString()
    );
    if (!ticket)
      return res
        .status(404)
        .json({ success: false, message: "Time slot not found" });

    if (ticket.soldSeats < seatsToCancel) {
      return res
        .status(400)
        .json({
          success: false,
          message: "You cannot cancel more seats than sold",
        });
    }

    ticket.availableSeats += seatsToCancel;
    ticket.soldSeats -= seatsToCancel;

    await bus.save();

    res.status(200).json({
      success: true,
      message: "Ticket canceled successfully",
      updatedAvailableSeats: ticket.availableSeats,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
