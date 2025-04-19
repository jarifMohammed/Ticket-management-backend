const express = require('express');

const { verifyToken, checkRole } = require('../middlewares/auth.middleware');
const { createBus,updateBus,deleteBus } = require('../controllers/bus.controller');
const router = express.Router();


router.post('/bus',verifyToken,checkRole(['admin']),createBus)
router.put('/bus/:id',verifyToken,checkRole(['admin']),updateBus)
router.delete('/bus/:id',verifyToken,checkRole(['admin']),deleteBus)

module.exports = router;