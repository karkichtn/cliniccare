const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

const timeToMinutes = (timeStr) => {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
};

const minutesToTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

const parseLocalDate = (dateInput) => {
  if (typeof dateInput === 'string' && dateInput.includes('-')) {
    const parts = dateInput.split('T')[0].split('-').map(Number);
    if (parts.length === 3 && !isNaN(parts[0]) && !isNaN(parts[1]) && !isNaN(parts[2])) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  }
  const dObj = new Date(dateInput);
  return new Date(dObj.getFullYear(), dObj.getMonth(), dObj.getDate());
};

const daysList = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

const appointmentController = {
  getAvailableSlots: async (req, res, next) => {
    try {
      const { doctorId, date } = req.query;

      if (!doctorId || !date) {
        return res.status(400).json({
          success: false,
          message: 'doctorId and date query parameters are required'
        });
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor || !doctor.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Active doctor not found'
        });
      }

      const queryDateStart = parseLocalDate(date);
      if (isNaN(queryDateStart.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid date format'
        });
      }

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (queryDateStart < todayStart) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
      }

      const selectedDayName = daysList[queryDateStart.getDay()];

      if (!doctor.availableDays.includes(selectedDayName)) {
        return res.status(200).json({
          success: true,
          count: 0,
          data: []
        });
      }

      const startMin = timeToMinutes(doctor.startTime);
      const endMin = timeToMinutes(doctor.endTime);
      const slotDuration = doctor.slotDuration || 30;

      const generatedSlots = [];
      for (let time = startMin; time + slotDuration <= endMin; time += slotDuration) {
        const slotStart = minutesToTime(time);
        const slotEnd = minutesToTime(time + slotDuration);

        if (queryDateStart.getTime() === todayStart.getTime()) {
          const currentMinutes = now.getHours() * 60 + now.getMinutes();
          if (time <= currentMinutes) {
            continue;
          }
        }

        generatedSlots.push({
          startTime: slotStart,
          endTime: slotEnd
        });
      }

      const nextDay = new Date(queryDateStart);
      nextDay.setDate(nextDay.getDate() + 1);

      const bookedAppointments = await Appointment.find({
        doctor: doctorId,
        appointmentDate: {
          $gte: queryDateStart,
          $lt: nextDay
        },
        status: { $ne: 'Cancelled' }
      });

      const bookedStartTimes = new Set(
        bookedAppointments.map((app) => app.startTime)
      );

      const availableSlots = generatedSlots.filter(
        (slot) => !bookedStartTimes.has(slot.startTime)
      );

      return res.status(200).json({
        success: true,
        count: availableSlots.length,
        data: availableSlots
      });
    } catch (error) {
      next(error);
    }
  },

  bookAppointment: async (req, res, next) => {
    try {
      const { doctorId, appointmentDate, startTime, endTime } = req.body;

      if (!doctorId || !appointmentDate || !startTime || !endTime) {
        return res.status(400).json({
          success: false,
          message: 'Doctor, appointment date, start time, and end time are required'
        });
      }

      const doctor = await Doctor.findById(doctorId);
      if (!doctor || !doctor.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Doctor is not available for booking'
        });
      }

      const appDateStart = parseLocalDate(appointmentDate);
      if (isNaN(appDateStart.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid appointment date format'
        });
      }

      const selectedDayName = daysList[appDateStart.getDay()];
      if (!doctor.availableDays.includes(selectedDayName)) {
        return res.status(400).json({
          success: false,
          message: `Doctor is not scheduled on ${selectedDayName}`
        });
      }

      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      if (appDateStart < todayStart) {
        return res.status(400).json({
          success: false,
          message: 'Cannot book appointments for past dates'
        });
      }

      if (appDateStart.getTime() === todayStart.getTime()) {
        const slotMinutes = timeToMinutes(startTime);
        const currentMinutes = now.getHours() * 60 + now.getMinutes();
        if (slotMinutes <= currentMinutes) {
          return res.status(400).json({
            success: false,
            message: 'Cannot book past time slots today'
          });
        }
      }

      const nextDay = new Date(appDateStart);
      nextDay.setDate(nextDay.getDate() + 1);

      const existingBooking = await Appointment.findOne({
        doctor: doctorId,
        appointmentDate: {
          $gte: appDateStart,
          $lt: nextDay
        },
        startTime,
        status: { $ne: 'Cancelled' }
      });

      if (existingBooking) {
        return res.status(409).json({
          success: false,
          message: 'This slot is already booked. Please choose another time.'
        });
      }

      const appointment = await Appointment.create({
        patient: req.user._id,
        doctor: doctorId,
        appointmentDate: appDateStart,
        startTime,
        endTime,
        status: 'Booked',
        consultationFee: doctor.consultationFee
      });

      const populatedAppointment = await Appointment.findById(appointment._id)
        .populate('doctor', 'name specialization consultationFee')
        .populate('patient', 'name email phone');

      return res.status(201).json({
        success: true,
        data: populatedAppointment
      });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(409).json({
          success: false,
          message: 'Concurrent booking conflict: This slot was just reserved.'
        });
      }
      next(error);
    }
  },

  getMyAppointments: async (req, res, next) => {
    try {
      const appointments = await Appointment.find({ patient: req.user._id })
        .populate('doctor', 'name specialization consultationFee availableDays')
        .sort({ appointmentDate: -1, startTime: -1 });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      next(error);
    }
  },

  getAppointmentById: async (req, res, next) => {
    try {
      const appointment = await Appointment.findById(req.params.id)
        .populate('doctor', 'name specialization consultationFee availableDays startTime endTime')
        .populate('patient', 'name email phone age gender');

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      if (
        req.user.role === 'patient' &&
        appointment.patient._id.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You cannot view another patient appointment'
        });
      }

      return res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  },

  cancelAppointment: async (req, res, next) => {
    try {
      const appointment = await Appointment.findById(req.params.id);

      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      if (
        req.user.role === 'patient' &&
        appointment.patient.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden: You cannot cancel another patient appointment'
        });
      }

      if (appointment.status === 'Completed') {
        return res.status(400).json({
          success: false,
          message: 'Completed appointments cannot be cancelled'
        });
      }

      if (appointment.status === 'Cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Appointment is already cancelled'
        });
      }

      appointment.status = 'Cancelled';
      await appointment.save();

      return res.status(200).json({
        success: true,
        message: 'Appointment cancelled successfully',
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  },

  getAdminAppointments: async (req, res, next) => {
    try {
      const { status, doctorId, date } = req.query;
      const query = {};

      if (status) {
        query.status = status;
      }

      if (doctorId) {
        query.doctor = doctorId;
      }

      if (date) {
        const queryDate = new Date(date);
        const start = new Date(
          queryDate.getFullYear(),
          queryDate.getMonth(),
          queryDate.getDate()
        );
        const end = new Date(start);
        end.setDate(end.getDate() + 1);
        query.appointmentDate = { $gte: start, $lt: end };
      }

      const appointments = await Appointment.find(query)
        .populate('doctor', 'name specialization consultationFee')
        .populate('patient', 'name email phone age gender')
        .sort({ appointmentDate: -1, startTime: 1 });

      return res.status(200).json({
        success: true,
        count: appointments.length,
        data: appointments
      });
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      const validStatuses = ['Booked', 'Checked-In', 'Completed', 'Cancelled'];

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      const current = appointment.status;

      if (current === 'Completed') {
        return res.status(400).json({
          success: false,
          message: 'Completed appointments cannot be changed'
        });
      }

      if (current === 'Cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cancelled appointments cannot be changed'
        });
      }

      if (current === 'Booked' && !['Checked-In', 'Cancelled'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Booked appointments can only transition to Checked-In or Cancelled'
        });
      }

      if (
        current === 'Checked-In' &&
        !['Completed', 'Cancelled'].includes(status)
      ) {
        return res.status(400).json({
          success: false,
          message: 'Checked-In appointments can only transition to Completed or Cancelled'
        });
      }

      appointment.status = status;
      await appointment.save();

      return res.status(200).json({
        success: true,
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  },

  updateVisit: async (req, res, next) => {
    try {
      const { diagnosis, prescriptionNotes } = req.body;

      const appointment = await Appointment.findById(req.params.id);
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found'
        });
      }

      if (appointment.status === 'Cancelled') {
        return res.status(400).json({
          success: false,
          message: 'Cannot record visit notes for a cancelled appointment'
        });
      }

      appointment.diagnosis = diagnosis !== undefined ? diagnosis : appointment.diagnosis;
      appointment.prescriptionNotes =
        prescriptionNotes !== undefined
          ? prescriptionNotes
          : appointment.prescriptionNotes;

      if (appointment.status === 'Checked-In') {
        appointment.status = 'Completed';
      }

      await appointment.save();

      return res.status(200).json({
        success: true,
        message: 'Visit details updated successfully',
        data: appointment
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = appointmentController;
