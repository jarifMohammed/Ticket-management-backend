const express = require("express");

const { verifyToken, checkRole } = require("../middlewares/auth.middleware");
const {
  createBus,
  updateBus,
  deleteBus,
  createTicket,
  updateTicket,
  deleteTicket,
} = require("../controllers/admin.controller");
const router = express.Router();

router.post("/bus", verifyToken, checkRole(["admin"]), createBus);
router.put("/bus/:id", verifyToken, checkRole(["admin"]), updateBus);
router.delete("/bus/:id", verifyToken, checkRole(["admin"]), deleteBus);

// tickets

router.post("/ticket", verifyToken, checkRole(["admin"]), createTicket);
router.put("/ticket/:id", verifyToken, checkRole(["admin"]), updateTicket);
router.delete("/ticket/:id", verifyToken, checkRole(["admin"]), deleteTicket);
module.exports = router;
