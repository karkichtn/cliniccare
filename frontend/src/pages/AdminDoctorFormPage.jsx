import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getDoctorById, createDoctor, updateDoctor } from '../api/doctorApi';

const allDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const AdminDoctorFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    consultationFee: '',
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    isActive: true
  });

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditing) {
      const fetchDoctor = async () => {
        try {
          const response = await getDoctorById(id);
          const d = response.data;
          setFormData({
            name: d.name || '',
            specialization: d.specialization || '',
            consultationFee: d.consultationFee !== undefined ? d.consultationFee : '',
            availableDays: d.availableDays || [],
            startTime: d.startTime || '09:00',
            endTime: d.endTime || '17:00',
            slotDuration: d.slotDuration || 30,
            isActive: d.isActive !== undefined ? d.isActive : true
          });
        } catch (err) {
          setError(err.message || 'Failed to load doctor profile.');
        } finally {
          setLoading(false);
        }
      };
      fetchDoctor();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDayToggle = (day) => {
    setFormData((prev) => {
      const exists = prev.availableDays.includes(day);
      return {
        ...prev,
        availableDays: exists
          ? prev.availableDays.filter((d) => d !== day)
          : [...prev.availableDays, day]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.availableDays.length === 0) {
      setError('Please select at least one available working day.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        consultationFee: Number(formData.consultationFee),
        slotDuration: Number(formData.slotDuration)
      };

      if (isEditing) {
        await updateDoctor(id, payload);
      } else {
        await createDoctor(payload);
      }

      navigate('/admin/doctors');
    } catch (err) {
      setError(err.message || 'Failed to save doctor.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loading-state"><p>Loading doctor form...</p></div>;
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          {isEditing ? 'Edit Doctor Profile' : 'Register New Doctor'}
        </h1>
        <Link to="/admin/doctors" className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>
          Cancel
        </Link>
      </div>

      <div className="card">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Doctor Full Name</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Dr. Sarah Jenkins"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Specialization</label>
              <input
                type="text"
                name="specialization"
                className="form-control"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="e.g. Cardiology"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Consultation Fee ($)</label>
              <input
                type="number"
                name="consultationFee"
                className="form-control"
                value={formData.consultationFee}
                onChange={handleChange}
                placeholder="e.g. 150"
                min="0"
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input
                type="time"
                name="startTime"
                className="form-control"
                value={formData.startTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">End Time</label>
              <input
                type="time"
                name="endTime"
                className="form-control"
                value={formData.endTime}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Slot Duration (Min)</label>
              <input
                type="number"
                name="slotDuration"
                className="form-control"
                value={formData.slotDuration}
                onChange={handleChange}
                min="10"
                step="5"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Available Days</label>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
              {allDays.map((day) => {
                const isChecked = formData.availableDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(day)}
                    style={{
                      padding: '0.4rem 0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      border: isChecked ? '1px solid var(--primary)' : '1px solid var(--border)',
                      background: isChecked ? 'var(--primary-light)' : '#ffffff',
                      color: isChecked ? 'var(--primary-dark)' : 'var(--text-muted)',
                      fontWeight: isChecked ? '700' : '500',
                      cursor: 'pointer',
                      fontSize: '0.85rem'
                    }}
                  >
                    {day.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <label htmlFor="isActive" style={{ fontSize: '0.9rem', cursor: 'pointer' }}>
              Active (Available for patient bookings)
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.25rem', padding: '0.75rem' }}
            disabled={submitting}
          >
            {submitting ? 'Saving Doctor...' : isEditing ? 'Update Doctor Profile' : 'Register Doctor'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDoctorFormPage;
