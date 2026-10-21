import { apiFetch } from './api';

export const register = async (userData) => {
  return await apiFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData)
  });
};

export const login = async (credentials) => {
  return await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  });
};

export const getMe = async () => {
  return await apiFetch('/auth/me');
};
