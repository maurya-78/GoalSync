import api from './api';

const adminService = {
  getAnalytics: () => api.get('/admin/analytics'),
  // Users
  getAllUsers: () => api.get('/admin/users'),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  // Cycles
  getCycles: () => api.get('/admin/cycles'),
  createCycle: (data) => api.post('/admin/cycles', data),
  updateCycle: (id, data) => api.put(`/admin/cycles/${id}`, data),
  deleteCycle: (id) => api.delete(`/admin/cycles/${id}`),
  // Departments
  getDepartments: () => api.get('/admin/departments'),
  createDepartment: (data) => api.post('/admin/departments', data),
  updateDepartment: (id, data) => api.put(`/admin/departments/${id}`, data),
  deleteDepartment: (id) => api.delete(`/admin/departments/${id}`),
  // Teams
  getTeams: () => api.get('/admin/teams'),
  createTeam: (data) => api.post('/admin/teams', data),
  updateTeam: (id, data) => api.put(`/admin/teams/${id}`, data),
  deleteTeam: (id) => api.delete(`/admin/teams/${id}`),
};

export default adminService;
