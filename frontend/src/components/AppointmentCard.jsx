import React from 'react';
import { Link } from 'react-router-dom';
import StatusBadge from './StatusBadge';

const AppointmentCard = ({ appointment, onCancel, isCancelling }) => {
  const formattedDate = new Date(appointment.appointmentDate).toLocaleDateString(
    'en-US',
    {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }
  );

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h4 style={{ fontSize: '1.05rem', fontWeight: '700' }}>
            {appointment.doctor?.name || 'Doctor'}
          </h4>
          <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: '600' }}>
            {appointment.doctor?.specialization || ''}
          </span>
        </div>
        <StatusBadge status={appointment.status} />
      </div>

      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        <div><strong>Date:</strong> {formattedDate}</div>
        <div><strong>Time:</strong> {appointment.startTime} - {appointment.endTime}</div>
        <div><strong>Fee:</strong> ${appointment.consultationFee}</div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
        <Link
          to={`/appointments/${appointment._id}`}
          className="btn btn-secondary"
          style={{ flex: 1, padding: '0.45rem', fontSize: '0.85rem' }}
        >
          Details & Notes
        </Link>

        {appointment.status === 'Booked' && onCancel && (
          <button
            onClick={() => onCancel(appointment._id)}
            disabled={isCancelling}
            className="btn btn-danger"
            style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;
