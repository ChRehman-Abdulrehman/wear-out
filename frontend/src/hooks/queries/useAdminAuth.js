import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export function useAdminAuth() {
  const { data: token, ...rest } = localStorage.getItem('wearout_admin_token')
    ? { token: localStorage.getItem('wearout_admin_token'), ...localStorage }
    : {};

  return {
    token,
    email: localStorage.getItem('wearout_admin_email'),
    isAuthenticated: !!token,
    login: (email, password) => api.login(email, password),
    logout: () => {
      localStorage.removeItem('wearout_admin_token');
      localStorage.removeItem('wearout_admin_email');
    },
    me: () => api.me(),
  };
}