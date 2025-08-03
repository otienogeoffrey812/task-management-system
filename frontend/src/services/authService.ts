import axios from '../api/axiosInstance';

interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

export const AuthService = {
  register: (data: {
    fullName: string;
    username: string;
    email: string;
    password: string;
  }) =>
    axios.post<{ data: AuthResponse }>('/auth/register', data),

  login: (data: { username: string; password: string }) =>
    axios.post<{ data: AuthResponse }>('/auth/login', data),

  logout: async () => {
    const userId = sessionStorage.getItem('userId');
    const token = localStorage.getItem('authToken');

    sessionStorage.clear();
    localStorage.removeItem('authToken');

    if (!userId || !token) {
      window.location.href = '/login';
      return;
    }

    try {
      await axios.post('/auth/logout', { userId, authToken: token });
    } catch (err) {
      console.warn('Logout error:', err);
    } finally {
      window.location.href = '/login';
    }
  },
};