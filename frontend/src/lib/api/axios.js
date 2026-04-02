import axios from 'axios'
import ENV from '../../config/env';

export const api = axios.create({
  baseURL: ENV.API_BACKEND_URL,
  withCredentials: true,
  timeout: 90000,
  headers: {'X-Custom-Header': 'foobar'}
});
