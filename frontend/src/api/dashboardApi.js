import { apiFetch } from './api';

export const getDashboard = async () => {
  return await apiFetch('/dashboard');
};
