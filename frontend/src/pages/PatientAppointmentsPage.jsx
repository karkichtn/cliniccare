import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAppointments, cancelAppointment } from '../api/appointmentApi';
import AppointmentCard from '../components/AppointmentCard';

const PatientAppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredStatus, setFilteredStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getMyAppointments();
      setAppointments(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load your appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    setCancellingId(id);
    setMessage('');
    setError('');
    try {
      await cancelAppointment(id);
      setMessage('Appointment cancelled successfully.');
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment.');
    } finally {
      setCancellingId(null);
    }
  };

  const displayedAppointments = appointments.filter((app) => {
    if (filteredStatus === 'All') return true;
    return app.status === filteredStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>My Appointments</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Track your consultations, schedule details, and clinical visit records.
          </p>
        </div>

        <Link to="/doctors" className="btn btn-primary">
          + Book New Appointment
        </Link>
      </div>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {['All', 'Booked', 'Checked-In', 'Completed', 'Cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilteredStatus(status)}
            className={`btn ${filteredStatus === status ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.9rem', fontSize: '0.85rem' }}
          >
            {status}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="loading-state">
          <p>Loading your appointments...</p>
        </div>
      ) : displayedAppointments.length === 0 ? (
        <div className="empty-state card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No appointments found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            {filteredStatus === 'All'
              ? 'You have not scheduled any doctor visits yet.'
              : `You have no appointments with status "${filteredStatus}".`}
          </p>
          <Link to="/doctors" className="btn btn-primary">
            Find a Doctor
          </Link>
        </div>
      ) : (
        <div className="grid-3">
          {displayedAppointments.map((app) => (
            <AppointmentCard
              key={app._id}
              appointment={app}
              onCancel={handleCancel}
              isCancelling={cancellingId === app._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientAppointmentsPage;
