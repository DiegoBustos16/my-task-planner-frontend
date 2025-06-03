import { environment } from '../../environment/environment';

const API_BASE_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  boards: {
    getAll: `${API_BASE_URL}/board/me`,
    create: `${API_BASE_URL}/board`,
    getById: (id: string) => `${API_BASE_URL}/board/${id}`,
  },
  users: {
    getCurrent: `${API_BASE_URL}/user/me`,
  },
};