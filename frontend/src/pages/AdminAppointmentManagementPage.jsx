import React, { useState, useEffect } from 'react';
import {
  getAdminAppointments,
  updateAppointmentStatus,
  updateAppointmentVisit
} from '../api/appointmentApi';
import StatusBadge from '../components/StatusBadge';
import VisitModal from '../components/VisitModal';

const AdminAppointmentManagementPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [activeModalApp, setActiveModalApp] = useState(null);
  const [isSavingVisit, setIsSavingVisit] = useState(false);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (dateFilter) params.date = dateFilter;
      const response = await getAdminAppointments(params);
      setAppointments(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load appointments.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [statusFilter, dateFilter]);

  const handleStatusChange = async (id, newStatus) => {
    setError('');
    setSuccessMsg('');
    try {
      await updateAppointmentStatus(id, newStatus);
      setSuccessMsg(`Status updated to ${newStatus}.`);
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Status transition failed.');
    }
  };

  const handleSaveVisit = async (id, visitData) => {
    setIsSavingVisit(true);
    setError('');
    try {
      await updateAppointmentVisit(id, visitData);
      setSuccessMsg('Visit notes recorded and appointment completed.');
      setActiveModalApp(null);
      fetchAppointments();
    } catch (err) {
      setError(err.message || 'Failed to save visit record.');
    } finally {
      setIsSavingVisit(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Clinic Appointment Master</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Manage patient check-ins, record completed visit notes, and supervise appointments.
        </p>
      </div>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Status:</label>
            <select
              className="form-control"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ width: 'auto' }}
            >
              <option value="">All Statuses</option>
              <option value="Booked">Booked</option>
              <option value="Checked-In">Checked-In</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: '600' }}>Date:</label>
            <input
              type="date"
              className="form-control"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              style={{ width: 'auto' }}
            />
            {dateFilter && (
              <button
                onClick={() => setDateFilter('')}
                className="btn btn-secondary"
                style={{ padding: '0.4rem 0.6rem', fontSize: '0.8rem' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><p>Loading appointments list...</p></div>
      ) : appointments.length === 0 ? (
        <div className="empty-state card">
          <p>No appointment records match the selected filters.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Date & Slot</th>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Fee</th>
                <th>Status</th>
                <th>Clinical Notes</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((app) => {
                const formattedDate = new Date(app.appointmentDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });

                return (
                  <tr key={app._id}>
                    <td>
                      <div style={{ fontWeight: '600' }}>{formattedDate}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {app.startTime} - {app.endTime}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '600' }}>{app.patient?.name || 'Unknown'}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {app.patient?.phone || app.patient?.email}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontWeight: '600' }}>{app.doctor?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                        {app.doctor?.specialization}
                      </div>
                    </td>

                    <td style={{ fontWeight: '600', color: 'var(--success)' }}>
                      ${app.consultationFee}
                    </td>

                    <td>
                      <StatusBadge status={app.status} />
                    </td>

                    <td>
                      {app.diagnosis ? (
                        <span style={{ fontSize: '0.8rem', color: 'var(--success)', fontWeight: '600' }}>
                          Recorded
                        </span>
                      ) : (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Pending
                        </span>
                      )}
                    </td>

                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {app.status === 'Booked' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app._id, 'Checked-In')}
                            className="btn btn-primary"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.35rem' }}
                          >
                            Check-In
                          </button>
                          <button
                            onClick={() => handleStatusChange(app._id, 'Cancelled')}
                            className="btn btn-danger"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {app.status === 'Checked-In' && (
                        <>
                          <button
                            onClick={() => setActiveModalApp(app)}
                            className="btn btn-primary"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.35rem' }}
                          >
                            Record Visit & Complete
                          </button>
                          <button
                            onClick={() => handleStatusChange(app._id, 'Cancelled')}
                            className="btn btn-danger"
                            style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                          >
                            Cancel
                          </button>
                        </>
                      )}

                      {app.status === 'Completed' && (
                        <button
                          onClick={() => setActiveModalApp(app)}
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                        >
                          View/Edit Notes
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <VisitModal
        isOpen={Boolean(activeModalApp)}
        onClose={() => setActiveModalApp(null)}
        appointment={activeModalApp}
        onSave={handleSaveVisit}
        isSaving={isSavingVisit}
      />
    </div>
  );
};

export default AdminAppointmentManagementPage;
