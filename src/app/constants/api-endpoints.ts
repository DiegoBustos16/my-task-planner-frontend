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
    update: (boardId: number) => `${API_BASE_URL}/board/${boardId}`,
    delete: (boardId: number) => `${API_BASE_URL}/board/${boardId}`,
  },
  users: {
    getCurrent: `${API_BASE_URL}/user/me`,
    update: `${API_BASE_URL}/user/me`,
    updatePassword: `${API_BASE_URL}/user/me/password`,
    delete: `${API_BASE_URL}/user/me`
  },
  tasks: {
    getByBoard: (boardId: number) => `${API_BASE_URL}/task/${boardId}`,
  },
};