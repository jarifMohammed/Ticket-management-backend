const Bus = require("../models/bus.model");
const dayjs = require("dayjs");
exports.createBus = async (req, res) => {
  try {
    const { busNumber, busType, capacity, route, departureTimes } = req.body;

    const formattedDepartureTimes = departureTimes.map((time) =>
      dayjs(time, "MMMM D, YYYY h:mm A").toDate()
    );
    const newBus = new Bus({
      busNumber,
      busType,
      capacity,
      route,
      departureTimes: formattedDepartureTimes,
    });
    await newBus.save();

    res.status(201).json({
      success: true,
      message: "Bus created successfully",
      bus: newBus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Bus not created",
      error: err.message,
    });
  }
};

// Update bus information by bus ID
exports.updateBus = async (req, res) => {
  try {
    const busId = req.params.id;
    const updates = req.body;

    // Find and update the bus by ID
    const updatedBus = await Bus.findByIdAndUpdate(busId, updates, {
      new: true,
    });

    if (!updatedBus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bus updated successfully",
      bus: updatedBus,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, could not update bus",
      error: err.message,
    });
  }
};

// Delete a bus by its ID
exports.deleteBus = async (req, res) => {
  try {
    const busId = req.params.id;

    // Find and delete the bus by ID
    const deletedBus = await Bus.findByIdAndDelete(busId);

    if (!deletedBus) {
      return res.status(404).json({
        success: false,
        message: "Bus not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bus deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error, could not delete bus",
      error: err.message,
    });
  }
};

// Ticket  adding functionality

exports.createTicket = async (req, res) => {
  try {
    const { busNumber, timeSlot, availableSeats, ticketPrice } = req.body;

    const bus = await Bus.findOne({ busNumber });
    if (!bus) {
      return res.status(404).json({ success: false, message: "Bus not found" });
    }

    const newTicket = {
      timeSlot: dayjs(timeSlot, "MMMM D, YYYY h:mm A").toDate(),
      availableSeats,
      ticketPrice,
    };

    bus.tickets.push(newTicket);
    await bus.save();

    res.status(201).json({
      success: true,
      message: "Ticket added successfully",
      ticket: newTicket,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;
    const updates = req.body;

    // Find the bus that contains this ticket
    const bus = await Bus.findOne({ "tickets._id": ticketId });
    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found in any bus" });
    }

    // Find the specific ticket in the tickets array
    const ticket = bus.tickets.id(ticketId);
    if (!ticket) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    // Apply updates to the found ticket
    Object.keys(updates).forEach((key) => {
      ticket[key] = updates[key];
    });

    // Save the updated bus document
    await bus.save();

    res.status(200).json({
      success: true,
      message: "Ticket updated successfully",
      ticket,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteTicket = async (req, res) => {
  try {
    const ticketId = req.params.id;

    const bus = await Bus.findOne({ "tickets._id": ticketId });
    if (!bus) {
      return res
        .status(404)
        .json({ success: false, message: "Ticket not found" });
    }

    bus.tickets = bus.tickets.filter((t) => t._id.toString() !== ticketId);
    await bus.save();

    res.status(200).json({
      success: true,
      message: "Ticket deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
