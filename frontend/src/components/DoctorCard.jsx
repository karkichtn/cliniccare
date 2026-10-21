import React from 'react';
import { Link } from 'react-router-dom';

const DoctorCard = ({ doctor }) => {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--text-main)' }}>{doctor.name}</h3>
            <span style={{ fontSize: '0.875rem', color: 'var(--primary)', fontWeight: '600' }}>
              {doctor.specialization}
            </span>
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--success)' }}>
            ${doctor.consultationFee}
          </span>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
          <strong>Working Hours:</strong> {doctor.startTime} - {doctor.endTime} ({doctor.slotDuration} min slots)
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
          <strong>Available:</strong> {doctor.availableDays ? doctor.availableDays.join(', ') : 'Weekdays'}
        </div>
      </div>

      <Link to={`/doctors/${doctor._id}`} className="btn btn-primary" style={{ width: '100%' }}>
        View Slots & Book
      </Link>
    </div>
  );
};

export default DoctorCard;
