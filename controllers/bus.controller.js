const Bus = require('../models/bus.model');
const dayjs = require('dayjs');
exports.createBus = async(req,res)=>{
    try{

        const { busNumber, busType, capacity, route, departureTimes } = req.body;

        const formattedDepartureTimes = departureTimes.map(time =>
            dayjs(time, 'MMMM D, YYYY h:mm A').toDate()
          );
        const newBus = new Bus({

            busNumber,
            busType,
            capacity,
            route,
            departureTimes: formattedDepartureTimes,
        })
        await newBus.save();

        res.status(201).json({
            success: true,
            message: "Bus created successfully",
            bus: newBus,
        });
    }catch(err){
        res.status(500).json({
            success: false,
            message: "Bus not created",
            error: err.message,
        });
    }
}

// Update bus information by bus ID
exports.updateBus = async (req, res) => {
    try {
      const busId = req.params.id;
      const updates = req.body;
  
      // Find and update the bus by ID
      const updatedBus = await Bus.findByIdAndUpdate(busId, updates, { new: true });
  
      if (!updatedBus) {
        return res.status(404).json({
          success: false,
          message: 'Bus not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Bus updated successfully',
        bus: updatedBus,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Server error, could not update bus',
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
          message: 'Bus not found',
        });
      }
  
      res.status(200).json({
        success: true,
        message: 'Bus deleted successfully',
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        message: 'Server error, could not delete bus',
        error: err.message,
      });
    }
  };
  