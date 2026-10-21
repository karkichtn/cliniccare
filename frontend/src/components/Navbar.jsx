import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M2 12h20" />
          </svg>
          ClinicCare
        </NavLink>

        <nav>
          <ul className="navbar-links">
            <li>
              <NavLink to="/" end>Home</NavLink>
            </li>
            <li>
              <NavLink to="/doctors">Find Doctors</NavLink>
            </li>

            {user && user.role === 'patient' && (
              <li>
                <NavLink to="/my-appointments">My Appointments</NavLink>
              </li>
            )}

            {user && (user.role === 'admin' || user.role === 'receptionist') && (
              <>
                <li>
                  <NavLink to="/admin/appointments">Appointments</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/doctors">Doctors</NavLink>
                </li>
                <li>
                  <NavLink to="/admin/dashboard">Dashboard</NavLink>
                </li>
              </>
            )}

            {user ? (
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginLeft: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {user.name} ({user.role})
                </span>
                <button onClick={handleLogout} className="btn btn-outline" style={{ padding: '0.35rem 0.75rem', fontSize: '0.85rem' }}>
                  Logout
                </button>
              </li>
            ) : (
              <>
                <li>
                  <NavLink to="/login">Login</NavLink>
                </li>
                <li>
                  <NavLink to="/register" className="btn btn-primary" style={{ padding: '0.4rem 0.9rem', color: '#fff' }}>
                    Register
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
