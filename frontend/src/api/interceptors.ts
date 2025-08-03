import {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
  AxiosResponse,
} from 'axios';

export function setupInterceptors(instance: AxiosInstance) {
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error)
  );

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
      const status = error.response?.status;

      if (status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
      }

      const message =
        (error.response?.data as any)?.message ||
        {
          400: 'Bad Request',
          401: 'Unauthorized - Please log in.',
          403: 'Forbidden',
          404: 'Not Found',
          500: 'Internal Server Error',
        }[status ?? 0] ||
        'Unknown error occurred';

      return Promise.reject(new Error(message));
    }
  );
}