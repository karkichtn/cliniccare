const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/authHandler');

router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctorById);
router.post('/', protect, authorize('admin', 'receptionist'), doctorController.createDoctor);
router.put('/:id', protect, authorize('admin', 'receptionist'), doctorController.updateDoctor);
router.delete('/:id', protect, authorize('admin', 'receptionist'), doctorController.deleteDoctor);

module.exports = router;
