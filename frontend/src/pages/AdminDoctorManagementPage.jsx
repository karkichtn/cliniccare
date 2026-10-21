import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDoctors, deleteDoctor, updateDoctor } from '../api/doctorApi';

const AdminDoctorManagementPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getDoctors({ all: true });
      setDoctors(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to load doctors.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) return;
    setError('');
    setActionSuccess('');
    try {
      await deleteDoctor(id);
      setActionSuccess(`Doctor ${name} deleted successfully.`);
      fetchDoctors();
    } catch (err) {
      setError(err.message || 'Could not delete doctor.');
    }
  };

  const handleToggleActive = async (doctor) => {
    setError('');
    setActionSuccess('');
    try {
      await updateDoctor(doctor._id, { isActive: !doctor.isActive });
      setActionSuccess(`Doctor status updated.`);
      fetchDoctors();
    } catch (err) {
      setError(err.message || 'Failed to update doctor status.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Doctor Management</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Configure clinic physicians, consultation fees, and available hours.
          </p>
        </div>

        <Link to="/admin/doctors/new" className="btn btn-primary">
          + Add New Doctor
        </Link>
      </div>

      {actionSuccess && <div className="alert alert-success">{actionSuccess}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-state"><p>Loading physicians...</p></div>
      ) : doctors.length === 0 ? (
        <div className="empty-state card">
          <p>No doctor records found in the clinic database.</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Specialization</th>
                <th>Fee</th>
                <th>Working Hours</th>
                <th>Days Available</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td style={{ fontWeight: '600' }}>{doctor.name}</td>
                  <td>{doctor.specialization}</td>
                  <td style={{ fontWeight: '600', color: 'var(--success)' }}>${doctor.consultationFee}</td>
                  <td>{doctor.startTime} - {doctor.endTime} ({doctor.slotDuration}m)</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {doctor.availableDays?.join(', ')}
                  </td>
                  <td>
                    <span
                      style={{
                        padding: '0.2rem 0.5rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        background: doctor.isActive ? 'var(--success-light)' : 'var(--danger-light)',
                        color: doctor.isActive ? 'var(--success)' : 'var(--danger)'
                      }}
                    >
                      {doctor.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button
                      onClick={() => handleToggleActive(doctor)}
                      className="btn btn-secondary"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.4rem' }}
                    >
                      {doctor.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <Link
                      to={`/admin/doctors/edit/${doctor._id}`}
                      className="btn btn-outline"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', marginRight: '0.4rem' }}
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => handleDelete(doctor._id, doctor.name)}
                      className="btn btn-danger"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDoctorManagementPage;
