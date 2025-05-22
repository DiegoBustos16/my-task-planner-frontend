import { environment } from '../../environment/environment';

const API_BASE_URL = environment.apiUrl;

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
  },
  boards: {
    getAll: `${API_BASE_URL}/boards`,
    create: `${API_BASE_URL}/boards`,
    getById: (id: string) => `${API_BASE_URL}/boards/${id}`,
  },
};