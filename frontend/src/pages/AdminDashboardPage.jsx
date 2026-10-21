import React, { useState, useEffect } from 'react';
import { getDashboard } from '../api/dashboardApi';
import StatusBadge from '../components/StatusBadge';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await getDashboard();
        setStats(response.data);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="loading-state"><p>Aggregating clinic statistics...</p></div>;
  }

  if (error || !stats) {
    return (
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto', textAlign: 'center' }}>
        <p className="alert alert-danger">{error || 'Could not fetch dashboard statistics.'}</p>
        <button onClick={() => window.location.reload()} className="btn btn-primary">Retry</button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700' }}>Executive Operations Dashboard</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Real-time aggregated metrics from database records.
        </p>
      </div>

      <div className="grid-4" style={{ marginBottom: '2rem' }}>
        <div className="metric-card">
          <div className="metric-label">Today's Appointments</div>
          <div className="metric-value">{stats.todayAppointmentsCount}</div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Completed Consultation Revenue</div>
          <div className="metric-value" style={{ color: 'var(--success)' }}>
            ${stats.consultationRevenue?.toLocaleString() || 0}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Cancellations</div>
          <div className="metric-value" style={{ color: 'var(--danger)' }}>
            {stats.cancellationCount}
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-label">Total Appointments Recorded</div>
          <div className="metric-value">{stats.totalAppointments}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card">
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            Doctor-wise Appointment Distribution
          </h2>

          {!stats.doctorWiseCounts || stats.doctorWiseCounts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No doctor booking activity recorded yet.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Specialty</th>
                    <th style={{ textAlign: 'center' }}>Total</th>
                    <th style={{ textAlign: 'center' }}>Completed</th>
                    <th style={{ textAlign: 'center' }}>Cancelled</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.doctorWiseCounts.map((doc) => (
                    <tr key={doc.doctorId}>
                      <td style={{ fontWeight: '600' }}>{doc.doctorName || 'Doctor'}</td>
                      <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{doc.specialization}</td>
                      <td style={{ textAlign: 'center', fontWeight: '600' }}>{doc.total}</td>
                      <td style={{ textAlign: 'center', color: 'var(--success)', fontWeight: '600' }}>{doc.completed}</td>
                      <td style={{ textAlign: 'center', color: 'var(--danger)', fontWeight: '600' }}>{doc.cancelled}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card">
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
            Recent Clinic Appointments
          </h2>

          {!stats.recentAppointments || stats.recentAppointments.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No recent activity to display.</p>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentAppointments.map((app) => (
                    <tr key={app._id}>
                      <td style={{ fontWeight: '600' }}>{app.patient?.name || 'Patient'}</td>
                      <td>{app.doctor?.name}</td>
                      <td>
                        <StatusBadge status={app.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
