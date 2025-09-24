import api from './api';

export const authService = {
  async register(username, password, isAdmin = false) {
    const response = await api.post('/auth/register', {
      username,
      password,
      isAdmin,
    });
    return response.data;
  },

  async login(username, password) {
    const response = await api.post('/auth/login', {
      username,
      password,
    });
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  },

  isAdmin() {
    const user = this.getCurrentUser();
    return user?.is_admin || false;
  },
};

