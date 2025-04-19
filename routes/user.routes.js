const express = require("express");
const router = express.Router();
const { verifyToken, checkRole } = require("../middlewares/auth.middleware");
const {
  getAllBuses,
  purchaseTicket,
  cancelTicket,
  getAvailableTickets,
} = require("../controllers/user.controller");

router.get("/busses", verifyToken, checkRole(["user"]), getAllBuses);
router.get("/tickets", verifyToken, checkRole(["user"]), getAvailableTickets);
router.post("/tickets", verifyToken, checkRole(["user"]), purchaseTicket);
router.delete("/tickets", verifyToken, checkRole(["user"]), cancelTicket);

module.exports = router;
