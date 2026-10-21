const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }
  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }
  next();
};

const validateDoctor = (req, res, next) => {
  const { name, specialization, consultationFee, availableDays, startTime, endTime } = req.body;
  if (!name || !specialization || consultationFee === undefined || !availableDays || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'All doctor fields including hours and available days are required'
    });
  }
  if (Number(consultationFee) < 0) {
    return res.status(400).json({
      success: false,
      message: 'Consultation fee cannot be negative'
    });
  }
  next();
};

const validateAppointment = (req, res, next) => {
  const { doctorId, appointmentDate, startTime, endTime } = req.body;
  if (!doctorId || !appointmentDate || !startTime || !endTime) {
    return res.status(400).json({
      success: false,
      message: 'Doctor, date, start time, and end time are required'
    });
  }
  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateDoctor,
  validateAppointment
};
