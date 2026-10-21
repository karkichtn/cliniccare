import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <p>&copy; {new Date().getFullYear()} ClinicCare — Clinic Appointment & Patient Visit System</p>
      </div>
    </footer>
  );
};

export default Footer;
