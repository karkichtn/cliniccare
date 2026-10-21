const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authHandler');

router.get('/', protect, authorize('admin', 'receptionist'), dashboardController.getDashboardStats);

module.exports = router;
