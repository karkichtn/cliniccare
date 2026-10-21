import React, { useState, useEffect } from 'react';
import { getDoctors } from '../api/doctorApi';
import DoctorCard from '../components/DoctorCard';

const DoctorListPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const specializations = [
    'All Specializations',
    'Cardiology',
    'Dermatology',
    'Pediatrics',
    'Orthopedics',
    'Neurology',
    'General Medicine',
    'Ophthalmology',
    'Psychiatry',
    'Gynecology',
    'ENT'
  ];

  const fetchDoctorsList = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (specialization && specialization !== 'All Specializations') {
        params.specialization = specialization;
      }
      const response = await getDoctors(params);
      setDoctors(response.data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch doctors list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchDoctorsList();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [search, specialization]);

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Our Medical Specialists
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Find the right specialist, check available working days, and schedule an appointment.
        </p>
      </div>

      <div className="card" style={{ marginBottom: '2rem', padding: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search by doctor name or specialty..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="form-control"
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            style={{ minWidth: '200px' }}
          >
            {specializations.map((spec) => (
              <option key={spec} value={spec === 'All Specializations' ? '' : spec}>
                {spec}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <p>Loading doctors schedule and availability...</p>
        </div>
      ) : doctors.length === 0 ? (
        <div className="empty-state card">
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>No doctors found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Try adjusting your search criteria or specialization filter.
          </p>
        </div>
      ) : (
        <div className="grid-3">
          {doctors.map((doctor) => (
            <DoctorCard key={doctor._id} doctor={doctor} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorListPage;
