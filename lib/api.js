import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Tests QI
export const testsAPI = {
  getAll: () => api.get('/tests'),
  getById: (id) => api.get(`/tests/${id}`),
  create: (data) => api.post('/tests', data),
  update: (id, data) => api.put(`/tests/${id}`, data),
  delete: (id) => api.delete(`/tests/${id}`),
  toggle: (id) => api.patch(`/tests/${id}/toggle`),
  searchByNiveau: (niveau) => api.get(`/tests/search/niveau?niveau=${niveau}`),
  getActifs: () => api.get('/tests/actifs'),
  countActifs: () => api.get('/tests/count/actifs'),
};

// Questions
export const questionsAPI = {
  getAll: () => api.get('/questions'),
  getById: (id) => api.get(`/questions/${id}`),
  getByTestId: (testId) => api.get(`/questions/test/${testId}`),
  create: (testId, data) => api.post(`/questions/test/${testId}`, data),
  update: (id, data) => api.put(`/questions/${id}`, data),
  delete: (id) => api.delete(`/questions/${id}`),
  countByTest: (testId) => api.get(`/questions/count/test/${testId}`),
};

export default api;