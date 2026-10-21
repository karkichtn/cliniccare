const Doctor = require('../models/Doctor');
const Appointment = require('../models/Appointment');

const doctorController = {
  getDoctors: async (req, res, next) => {
    try {
      const { search, specialization, all } = req.query;
      const query = {};

      if (all !== 'true') {
        query.isActive = true;
      }

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { specialization: { $regex: search, $options: 'i' } }
        ];
      }

      if (specialization) {
        query.specialization = specialization;
      }

      const doctors = await Doctor.find(query).sort({ name: 1 });

      return res.status(200).json({
        success: true,
        count: doctors.length,
        data: doctors
      });
    } catch (error) {
      next(error);
    }
  },

  getDoctorById: async (req, res, next) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }
      return res.status(200).json({
        success: true,
        data: doctor
      });
    } catch (error) {
      next(error);
    }
  },

  createDoctor: async (req, res, next) => {
    try {
      const {
        name,
        specialization,
        consultationFee,
        availableDays,
        startTime,
        endTime,
        slotDuration,
        isActive
      } = req.body;

      if (!name || !specialization || consultationFee === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Name, specialization, and consultation fee are required'
        });
      }

      const doctor = await Doctor.create({
        name,
        specialization,
        consultationFee: Number(consultationFee),
        availableDays: availableDays || [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday'
        ],
        startTime: startTime || '09:00',
        endTime: endTime || '17:00',
        slotDuration: slotDuration ? Number(slotDuration) : 30,
        isActive: isActive !== undefined ? Boolean(isActive) : true
      });

      return res.status(201).json({
        success: true,
        data: doctor
      });
    } catch (error) {
      next(error);
    }
  },

  updateDoctor: async (req, res, next) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      const updatedDoctor = await Doctor.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true
        }
      );

      return res.status(200).json({
        success: true,
        data: updatedDoctor
      });
    } catch (error) {
      next(error);
    }
  },

  deleteDoctor: async (req, res, next) => {
    try {
      const doctor = await Doctor.findById(req.params.id);
      if (!doctor) {
        return res.status(404).json({
          success: false,
          message: 'Doctor not found'
        });
      }

      const activeAppointments = await Appointment.countDocuments({
        doctor: req.params.id,
        status: { $in: ['Booked', 'Checked-In'] }
      });

      if (activeAppointments > 0) {
        return res.status(400).json({
          success: false,
          message: `Cannot delete doctor: Doctor has ${activeAppointments} active upcoming appointment(s). Deactivate the doctor instead.`
        });
      }

      await Doctor.findByIdAndDelete(req.params.id);

      return res.status(200).json({
        success: true,
        message: 'Doctor deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = doctorController;
