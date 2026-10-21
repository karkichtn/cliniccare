import { apiFetch } from './api';

export const getAvailableSlots = async (doctorId, date) => {
  return await apiFetch(
    `/appointments/available-slots?doctorId=${encodeURIComponent(doctorId)}&date=${encodeURIComponent(date)}`
  );
};

export const bookAppointment = async (appointmentData) => {
  return await apiFetch('/appointments', {
    method: 'POST',
    body: JSON.stringify(appointmentData)
  });
};

export const getMyAppointments = async () => {
  return await apiFetch('/appointments/my');
};

export const getAppointmentById = async (id) => {
  return await apiFetch(`/appointments/${id}`);
};

export const cancelAppointment = async (id) => {
  return await apiFetch(`/appointments/${id}/cancel`, {
    method: 'PATCH'
  });
};

export const getAdminAppointments = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.status) query.append('status', params.status);
  if (params.doctorId) query.append('doctorId', params.doctorId);
  if (params.date) query.append('date', params.date);

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await apiFetch(`/appointments/admin${queryString}`);
};

export const updateAppointmentStatus = async (id, status) => {
  return await apiFetch(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  });
};

export const updateAppointmentVisit = async (id, visitData) => {
  return await apiFetch(`/appointments/${id}/visit`, {
    method: 'PATCH',
    body: JSON.stringify(visitData)
  });
};
