const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const User = require('../models/User');

const dashboardController = {
  getDashboardStats: async (req, res, next) => {
    try {
      const now = new Date();
      const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfToday = new Date(startOfToday);
      endOfToday.setDate(endOfToday.getDate() + 1);

      const todayAppointmentsCount = await Appointment.countDocuments({
        appointmentDate: {
          $gte: startOfToday,
          $lt: endOfToday
        }
      });

      const cancellationCount = await Appointment.countDocuments({
        status: 'Cancelled'
      });

      const revenueAggregation = await Appointment.aggregate([
        {
          $match: {
            status: 'Completed'
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: '$consultationFee' }
          }
        }
      ]);

      const consultationRevenue =
        revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

      const doctorWiseCounts = await Appointment.aggregate([
        {
          $group: {
            _id: '$doctor',
            total: { $sum: 1 },
            completed: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Completed'] }, 1, 0]
              }
            },
            cancelled: {
              $sum: {
                $cond: [{ $eq: ['$status', 'Cancelled'] }, 1, 0]
              }
            }
          }
        },
        {
          $lookup: {
            from: 'doctors',
            localField: '_id',
            foreignField: '_id',
            as: 'doctorInfo'
          }
        },
        {
          $unwind: {
            path: '$doctorInfo',
            preserveNullAndEmptyArrays: true
          }
        },
        {
          $project: {
            doctorId: '$_id',
            doctorName: '$doctorInfo.name',
            specialization: '$doctorInfo.specialization',
            total: 1,
            completed: 1,
            cancelled: 1
          }
        },
        {
          $sort: { total: -1 }
        }
      ]);

      const totalDoctors = await Doctor.countDocuments();
      const totalPatients = await User.countDocuments({ role: 'patient' });
      const totalAppointments = await Appointment.countDocuments();

      const recentAppointments = await Appointment.find()
        .populate('doctor', 'name specialization')
        .populate('patient', 'name email')
        .sort({ createdAt: -1 })
        .limit(5);

      return res.status(200).json({
        success: true,
        data: {
          todayAppointmentsCount,
          cancellationCount,
          consultationRevenue,
          doctorWiseCounts,
          totalDoctors,
          totalPatients,
          totalAppointments,
          recentAppointments
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = dashboardController;
