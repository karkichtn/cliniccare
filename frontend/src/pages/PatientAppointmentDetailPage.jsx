import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getAppointmentById, cancelAppointment } from '../api/appointmentApi';
import StatusBadge from '../components/StatusBadge';

const PatientAppointmentDetailPage = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  const fetchDetails = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getAppointmentById(id);
      setAppointment(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load appointment details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm('Confirm cancellation for this appointment?')) return;
    try {
      await cancelAppointment(id);
      setActionMessage('Appointment successfully cancelled.');
      fetchDetails();
    } catch (err) {
      setError(err.message || 'Failed to cancel appointment.');
    }
  };

  if (loading) {
    return <div className="loading-state"><p>Loading appointment details...</p></div>;
  }

  if (error || !appointment) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <p className="alert alert-danger">{error || 'Appointment record not found.'}</p>
        <Link to="/my-appointments" className="btn btn-primary">Back to Appointments</Link>
      </div>
    );
  }

  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate(-1)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          &larr; Back
        </button>
        <StatusBadge status={appointment.status} />
      </div>

      {actionMessage && <div className="alert alert-success">{actionMessage}</div>}

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.35rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          Consultation Summary
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Doctor</div>
            <div style={{ fontSize: '1.1rem', fontWeight: '700' }}>{appointment.doctor?.name}</div>
            <div style={{ color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>{appointment.doctor?.specialization}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scheduled Date & Slot</div>
            <div style={{ fontWeight: '600' }}>{formattedDate}</div>
            <div style={{ color: 'var(--text-muted)' }}>{appointment.startTime} - {appointment.endTime}</div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Consultation Fee</div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--success)' }}>
              ${appointment.consultationFee}
            </div>
          </div>
        </div>

        {appointment.status === 'Booked' && (
          <div style={{ marginTop: '1.5rem', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
            <button onClick={handleCancel} className="btn btn-danger" style={{ padding: '0.5rem 1rem' }}>
              Cancel Appointment
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
          Clinical Visit Record & Prescriptions
        </h3>

        {appointment.diagnosis || appointment.prescriptionNotes ? (
          <div>
            <div style={{ marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Diagnosis & Clinical Notes:
              </h4>
              <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.95rem', whiteSpace: 'pre-wrap' }}>
                {appointment.diagnosis || 'No specific diagnosis notes recorded.'}
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                Prescription & Medication Instructions:
              </h4>
              <div style={{ background: '#f0fdf4', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid #bbf7d0', fontSize: '0.95rem', color: '#166534', whiteSpace: 'pre-wrap' }}>
                {appointment.prescriptionNotes || 'No medication prescribed.'}
              </div>
            </div>
          </div>
        ) : (
          <div className="empty-state" style={{ padding: '2rem 1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {appointment.status === 'Completed'
                ? 'No clinical notes were recorded for this completed session.'
                : 'Clinical notes and prescriptions will be visible here once your consultation is completed by the doctor.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientAppointmentDetailPage;
