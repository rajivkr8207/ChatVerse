import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  timeout: 90000,
  headers: {'X-Custom-Header': 'foobar'}
});
