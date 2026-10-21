require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Doctor = require('./models/Doctor');
const Appointment = require('./models/Appointment');

const seedData = async () => {
  if (!process.env.MONGO_URI) {
    console.error('Error: Please provide MONGO_URI in backend/.env before running seed.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB Atlas for seeding.');

    await Appointment.deleteMany({});
    await Doctor.deleteMany({});
    await User.deleteMany({});

    const admin = await User.create({
      name: 'System Administrator',
      email: 'admin@clinic.com',
      password: 'AdminPassword123!',
      role: 'admin',
      phone: '+1-555-0100',
      age: 40,
      gender: 'prefer_not_to_say'
    });

    const receptionist = await User.create({
      name: 'Front Desk Receptionist',
      email: 'reception@clinic.com',
      password: 'StaffPassword123!',
      role: 'receptionist',
      phone: '+1-555-0101',
      age: 32,
      gender: 'female'
    });

    const patient1 = await User.create({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'Password123!',
      role: 'patient',
      phone: '+1-555-0199',
      age: 29,
      gender: 'female'
    });

    const patient2 = await User.create({
      name: 'Robert Smith',
      email: 'robert@example.com',
      password: 'Password123!',
      role: 'patient',
      phone: '+1-555-0144',
      age: 52,
      gender: 'male'
    });

    const doctorsData = [
      {
        name: 'Dr. Sarah Jenkins',
        specialization: 'Cardiology',
        consultationFee: 150,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: '09:00',
        endTime: '13:00',
        slotDuration: 30,
        isActive: true
      },
      {
        name: 'Dr. Marcus Patel',
        specialization: 'Dermatology',
        consultationFee: 120,
        availableDays: ['Monday', 'Tuesday', 'Thursday'],
        startTime: '10:00',
        endTime: '16:00',
        slotDuration: 30,
        isActive: true
      },
      {
        name: 'Dr. Emily Wong',
        specialization: 'Pediatrics',
        consultationFee: 100,
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        startTime: '08:30',
        endTime: '14:30',
        slotDuration: 30,
        isActive: true
      },
      {
        name: 'Dr. Michael Chen',
        specialization: 'Orthopedics',
        consultationFee: 160,
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        startTime: '09:00',
        endTime: '15:00',
        slotDuration: 45,
        isActive: true
      },
      {
        name: 'Dr. Rachel Adams',
        specialization: 'Neurology',
        consultationFee: 180,
        availableDays: ['Monday', 'Thursday'],
        startTime: '11:00',
        endTime: '17:00',
        slotDuration: 45,
        isActive: true
      },
      {
        name: 'Dr. David Kim',
        specialization: 'General Medicine',
        consultationFee: 80,
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        startTime: '08:00',
        endTime: '16:00',
        slotDuration: 20,
        isActive: true
      },
      {
        name: 'Dr. Olivia Martinez',
        specialization: 'Ophthalmology',
        consultationFee: 130,
        availableDays: ['Wednesday', 'Friday', 'Saturday'],
        startTime: '09:30',
        endTime: '15:30',
        slotDuration: 30,
        isActive: true
      },
      {
        name: 'Dr. James Wilson',
        specialization: 'Psychiatry',
        consultationFee: 140,
        availableDays: ['Monday', 'Tuesday', 'Wednesday'],
        startTime: '13:00',
        endTime: '19:00',
        slotDuration: 50,
        isActive: true
      },
      {
        name: 'Dr. Priya Sharma',
        specialization: 'Gynecology',
        consultationFee: 135,
        availableDays: ['Tuesday', 'Wednesday', 'Friday'],
        startTime: '10:00',
        endTime: '16:00',
        slotDuration: 30,
        isActive: true
      },
      {
        name: 'Dr. Brian Taylor',
        specialization: 'ENT',
        consultationFee: 110,
        availableDays: ['Monday', 'Thursday', 'Friday'],
        startTime: '09:00',
        endTime: '14:00',
        slotDuration: 30,
        isActive: true
      }
    ];

    const createdDoctors = await Doctor.insertMany(doctorsData);

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    await Appointment.create([
      {
        patient: patient1._id,
        doctor: createdDoctors[0]._id,
        appointmentDate: today,
        startTime: '09:00',
        endTime: '09:30',
        status: 'Checked-In',
        consultationFee: createdDoctors[0].consultationFee
      },
      {
        patient: patient2._id,
        doctor: createdDoctors[1]._id,
        appointmentDate: today,
        startTime: '10:00',
        endTime: '10:30',
        status: 'Booked',
        consultationFee: createdDoctors[1].consultationFee
      },
      {
        patient: patient1._id,
        doctor: createdDoctors[2]._id,
        appointmentDate: yesterday,
        startTime: '09:00',
        endTime: '09:30',
        status: 'Completed',
        consultationFee: createdDoctors[2].consultationFee,
        diagnosis: 'Seasonal allergic rhinitis with mild pharyngitis.',
        prescriptionNotes: 'Cetirizine 10mg once daily at bedtime for 10 days. Saline nasal spray twice daily.'
      },
      {
        patient: patient2._id,
        doctor: createdDoctors[0]._id,
        appointmentDate: twoDaysAgo,
        startTime: '11:00',
        endTime: '11:30',
        status: 'Completed',
        consultationFee: createdDoctors[0].consultationFee,
        diagnosis: 'Stage 1 essential hypertension routine review.',
        prescriptionNotes: 'Continue Amlodipine 5mg daily. Low-sodium diet and repeat BP measurement in 6 weeks.'
      },
      {
        patient: patient2._id,
        doctor: createdDoctors[3]._id,
        appointmentDate: yesterday,
        startTime: '14:00',
        endTime: '14:45',
        status: 'Cancelled',
        consultationFee: createdDoctors[3].consultationFee
      }
    ]);

    console.log('Seeding completed successfully:');
    console.log('- 1 Admin (admin@clinic.com / AdminPassword123!)');
    console.log('- 1 Receptionist (reception@clinic.com / StaffPassword123!)');
    console.log('- 2 Patients (jane@example.com, robert@example.com / Password123!)');
    console.log(`- ${createdDoctors.length} Doctors`);
    console.log('- 5 Sample Appointments with workflow statuses and visit notes');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error.message);
    process.exit(1);
  }
};

seedData();
