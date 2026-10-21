const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Doctor name is required'],
      trim: true
    },
    specialization: {
      type: String,
      required: [true, 'Specialization is required'],
      trim: true
    },
    consultationFee: {
      type: Number,
      required: [true, 'Consultation fee is required'],
      min: [0, 'Fee cannot be negative']
    },
    availableDays: {
      type: [String],
      required: [true, 'Available days are required'],
      default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    startTime: {
      type: String,
      required: [true, 'Start time is required'],
      default: '09:00'
    },
    endTime: {
      type: String,
      required: [true, 'End time is required'],
      default: '17:00'
    },
    slotDuration: {
      type: Number,
      required: true,
      default: 30,
      min: [10, 'Slot duration must be at least 10 minutes']
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
