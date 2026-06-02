import axios from 'axios'
import ENV from '../../config/env';

export const api = axios.create({
  baseURL: ENV.API_BACKEND_URL,
  withCredentials: true,
  timeout: 90000,
  headers: { 'X-Custom-Header': 'foobar' }
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    let originalReq = error.config;
    if (error.response.status === 401 && !originalReq.retry) {
      originalReq.retry = true;
      try {
        await api.get("/api/auth/refresh-token");
        return api(originalReq);
      } catch (error) {
        window.location.href = "/";
        return Promise.reject(error);
      }
    }
  }
);