import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = ({ user }) => {
  return (
    <div>
      <section style={{ textAlign: 'center', padding: '3.5rem 1rem', background: 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)', borderRadius: 'var(--radius-lg)', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', lineHeight: '1.2' }}>
          Seamless Clinic Appointments & Patient Care
        </h1>
        <p style={{ fontSize: '1.15rem', color: 'var(--text-muted)', maxWidth: '640px', margin: '0 auto 2rem auto' }}>
          Schedule appointments with specialized doctors in real time, view diagnostic summaries, and manage your family health visits without the waiting room hassle.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/doctors" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
            Browse Doctors & Book
          </Link>
          {!user ? (
            <Link to="/register" className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              Create Patient Account
            </Link>
          ) : user.role === 'patient' ? (
            <Link to="/my-appointments" className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              View My Appointments
            </Link>
          ) : (
            <Link to="/admin/dashboard" className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}>
              Go to Staff Dashboard
            </Link>
          )}
        </div>
      </section>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1.5rem', textAlign: 'center' }}>
          Why Choose ClinicCare?
        </h2>
        <div className="grid-3">
          <div className="card">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🩺</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Verified Specialists</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Access experienced cardiologists, dermatologists, pediatricians, and more with transparent fees and schedule profiles.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⏱️</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Real-time Slot Booking</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Select exact working hour slots. Our conflict-prevention engine guarantees no double-booking or slot collisions.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📋</div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Digital Visit Notes</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Access clinical diagnoses and doctor prescriptions securely after every completed consultation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
