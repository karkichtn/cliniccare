import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDoctorById } from '../api/doctorApi';
import { getAvailableSlots, bookAppointment } from '../api/appointmentApi';

const DoctorDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoading(true);
      try {
        const response = await getDoctorById(id);
        setDoctor(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load doctor profile.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  useEffect(() => {
    if (!id || !selectedDate) return;

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlot(null);
      setBookingError('');
      try {
        const response = await getAvailableSlots(id, selectedDate);
        setSlots(response.data || []);
      } catch (err) {
        setSlots([]);
        setBookingError(err.message || 'Failed to load slots for this date.');
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [id, selectedDate]);

  const handleBook = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'patient') {
      setBookingError('Only registered patients can book appointments.');
      return;
    }

    if (!selectedSlot) {
      setBookingError('Please choose an available time slot.');
      return;
    }

    setBookingLoading(true);
    setBookingError('');
    setBookingSuccess('');

    try {
      await bookAppointment({
        doctorId: id,
        appointmentDate: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime
      });

      setBookingSuccess('Appointment confirmed successfully!');
      setTimeout(() => {
        navigate('/my-appointments');
      }, 1500);
    } catch (err) {
      setBookingError(err.message || 'Could not complete booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="loading-state"><p>Loading doctor profile...</p></div>;
  }

  if (error || !doctor) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <p className="alert alert-danger">{error || 'Doctor not found'}</p>
        <Link to="/doctors" className="btn btn-primary">Back to Doctors</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1.25rem', marginBottom: '1.25rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>{doctor.name}</h1>
            <p style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '1rem' }}>{doctor.specialization}</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--success)' }}>${doctor.consultationFee}</span>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Per Consultation</div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          <div><strong>Consultation Hours:</strong> {doctor.startTime} - {doctor.endTime}</div>
          <div><strong>Slot Duration:</strong> {doctor.slotDuration} minutes</div>
          <div><strong>Active Days:</strong> {doctor.availableDays?.join(', ')}</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem' }}>Select Date & Time Slot</h2>

        {bookingSuccess && <div className="alert alert-success">{bookingSuccess}</div>}
        {bookingError && <div className="alert alert-danger">{bookingError}</div>}

        <div className="form-group" style={{ maxWidth: '300px' }}>
          <label className="form-label">Appointment Date</label>
          <input
            type="date"
            className="form-control"
            min={todayStr}
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </div>

        <div style={{ marginTop: '1.5rem' }}>
          <label className="form-label" style={{ marginBottom: '0.75rem' }}>Available Time Slots</label>

          {loadingSlots ? (
            <p style={{ color: 'var(--text-muted)' }}>Checking doctor schedule...</p>
          ) : slots.length === 0 ? (
            <div className="empty-state" style={{ padding: '1.5rem', background: '#f8fafc', borderRadius: 'var(--radius-sm)' }}>
              <p>No available slots on this date. Doctor may not be scheduled or all slots are occupied.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.75rem' }}>
              {slots.map((slot) => {
                const isSelected =
                  selectedSlot &&
                  selectedSlot.startTime === slot.startTime &&
                  selectedSlot.endTime === slot.endTime;

                return (
                  <button
                    key={slot.startTime}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    className="btn"
                    style={{
                      border: isSelected ? '2px solid var(--primary)' : '1px solid var(--border)',
                      background: isSelected ? 'var(--primary-light)' : '#ffffff',
                      color: isSelected ? 'var(--primary-dark)' : 'var(--text-main)',
                      fontWeight: isSelected ? '700' : '500',
                      padding: '0.6rem 0.5rem',
                      fontSize: '0.85rem'
                    }}
                  >
                    {slot.startTime} - {slot.endTime}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
          {selectedSlot && (
            <div style={{ marginBottom: '1rem', fontSize: '0.95rem' }}>
              Selected Time: <strong>{selectedSlot.startTime} - {selectedSlot.endTime}</strong> on <strong>{selectedDate}</strong>
            </div>
          )}

          {!user ? (
            <Link to="/login" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
              Sign In to Book This Slot
            </Link>
          ) : user.role !== 'patient' ? (
            <p style={{ color: 'var(--warning)', fontSize: '0.9rem' }}>
              Logged in as staff ({user.role}). Only patients can reserve consultations.
            </p>
          ) : (
            <button
              onClick={handleBook}
              disabled={!selectedSlot || bookingLoading}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {bookingLoading ? 'Reserving Slot...' : `Confirm Appointment ($${doctor.consultationFee})`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDetailPage;
