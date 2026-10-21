const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { protect, authorize } = require('../middleware/authHandler');

router.get('/available-slots', appointmentController.getAvailableSlots);
router.post('/', protect, appointmentController.bookAppointment);
router.get('/my', protect, appointmentController.getMyAppointments);
router.get('/admin', protect, authorize('admin', 'receptionist'), appointmentController.getAdminAppointments);
router.patch('/:id/cancel', protect, appointmentController.cancelAppointment);
router.patch('/:id/status', protect, authorize('admin', 'receptionist'), appointmentController.updateStatus);
router.patch('/:id/visit', protect, authorize('admin', 'receptionist'), appointmentController.updateVisit);
router.get('/:id', protect, appointmentController.getAppointmentById);

module.exports = router;
