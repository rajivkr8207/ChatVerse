import axios from 'axios'
import ENV from '../../config/env';

export const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  timeout: 90000,
  headers: {'X-Custom-Header': 'foobar'}
});
