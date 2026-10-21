import { apiFetch } from './api';

export const getDoctors = async (params = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.append('search', params.search);
  if (params.specialization) query.append('specialization', params.specialization);
  if (params.all) query.append('all', 'true');

  const queryString = query.toString() ? `?${query.toString()}` : '';
  return await apiFetch(`/doctors${queryString}`);
};

export const getDoctorById = async (id) => {
  return await apiFetch(`/doctors/${id}`);
};

export const createDoctor = async (doctorData) => {
  return await apiFetch('/doctors', {
    method: 'POST',
    body: JSON.stringify(doctorData)
  });
};

export const updateDoctor = async (id, doctorData) => {
  return await apiFetch(`/doctors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(doctorData)
  });
};

export const deleteDoctor = async (id) => {
  return await apiFetch(`/doctors/${id}`, {
    method: 'DELETE'
  });
};
