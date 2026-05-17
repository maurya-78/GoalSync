import API from './api';

const goalService = {
  // Fetch logged-in user's goal sheet
  getMyGoalSheet: async () => {
    const response = await API.get('/goals/sheet');
    return response.data;
  },

  // Create or Update a goal sheet
  upsertGoalSheet: async (goalsData) => {
    const response = await API.post('/goals/sheet', { goals: goalsData });
    return response.data;
  },

  // Update specific goal progress
  updateProgress: async (progressUpdates) => {
    // progressUpdates: [{ goalId, progress, comment }]
    const response = await API.patch('/goals/progress', { updates: progressUpdates });
    return response.data;
  },

  // Manager specific: Review and approve sheet
  reviewGoalSheet: async (sheetId, status, feedback) => {
    const response = await API.patch(`/management/review/${sheetId}`, { status, feedback });
    return response.data;
  }
};

export default goalService;