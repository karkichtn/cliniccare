import React, { useState, useEffect } from 'react';

const VisitModal = ({ isOpen, onClose, appointment, onSave, isSaving }) => {
  const [diagnosis, setDiagnosis] = useState('');
  const [prescriptionNotes, setPrescriptionNotes] = useState('');

  useEffect(() => {
    if (appointment) {
      setDiagnosis(appointment.diagnosis || '');
      setPrescriptionNotes(appointment.prescriptionNotes || '');
    }
  }, [appointment]);

  if (!isOpen || !appointment) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(appointment._id, { diagnosis, prescriptionNotes });
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Record Clinical Visit Details</h3>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-muted)' }}
          >
            &times;
          </button>
        </div>

        <div style={{ background: '#f8fafc', padding: '0.75rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem', fontSize: '0.85rem' }}>
          <div><strong>Patient:</strong> {appointment.patient?.name} ({appointment.patient?.email})</div>
          <div><strong>Doctor:</strong> {appointment.doctor?.name} ({appointment.doctor?.specialization})</div>
          <div><strong>Slot:</strong> {appointment.startTime} - {appointment.endTime}</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Clinical Diagnosis</label>
            <textarea
              className="form-control"
              rows="3"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              placeholder="Enter diagnosis observations..."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prescription & Advice Notes</label>
            <textarea
              className="form-control"
              rows="4"
              value={prescriptionNotes}
              onChange={(e) => setPrescriptionNotes(e.target.value)}
              placeholder="Enter prescribed medications, dosage, and instructions..."
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
            <button type="button" onClick={onClose} className="btn btn-secondary" disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save & Complete Visit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitModal;
