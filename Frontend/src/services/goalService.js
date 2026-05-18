import api from './api';

const goalService = {
  getGoals: (params) => api.get('/goals', { params }),
  getGoal: (id) => api.get(`/goals/${id}`),
  createGoal: (data) => api.post('/goals', data),
  updateGoal: (id, data) => api.put(`/goals/${id}`, data),
  deleteGoal: (id) => api.delete(`/goals/${id}`),
  reviewGoal: (id, data) => api.put(`/goals/${id}/review`, data),
  getAnalytics: () => api.get('/goals/analytics'),
};

export default goalService;
