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
    create: (boardId: number) => `${API_BASE_URL}/task/${boardId}`,
    update: (taskId: number) => `${API_BASE_URL}/task/${taskId}`,
    toggleCheck: (taskId: number) => `${API_BASE_URL}/task/toggle/${taskId}`,
    delete: (taskId: number) => `${API_BASE_URL}/task/${taskId}`
  },
  items: {
    create: (taskId: number) => `${API_BASE_URL}/item/${taskId}`,
    update: (itemId: number) => `${API_BASE_URL}/item/${itemId}`,
    toggleCheck: (itemId: number) => `${API_BASE_URL}/item/toggle/${itemId}`,
    delete: (itemId: number) => `${API_BASE_URL}/item/${itemId}`
  }
};