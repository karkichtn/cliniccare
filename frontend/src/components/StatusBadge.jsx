import React from 'react';

const StatusBadge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s) {
      case 'Booked':
        return 'badge badge-booked';
      case 'Checked-In':
        return 'badge badge-checkedin';
      case 'Completed':
        return 'badge badge-completed';
      case 'Cancelled':
        return 'badge badge-cancelled';
      default:
        return 'badge';
    }
  };

  return <span className={getBadgeClass(status)}>{status}</span>;
};

export default StatusBadge;
