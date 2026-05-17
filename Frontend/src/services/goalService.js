import api from './axios'; // Using the centralized axios instance

/**
 * STRATEGIC GOAL SERVICE (ENTERPRISE VERSION)
 * -------------------------------------------
 * Merged logic for Individual CRUD, Bulk Operations, and Managerial Reviews.
 */

const goalService = {
  
  // ==========================================
  // 1. EMPLOYEE / CORE OPERATIONS
  // ==========================================

  /**
   * Fetch or Initialize a Goal Sheet for a specific cycle
   * @param {string} cycleId - Corporate cycle reference
   */
  getOrCreateGoalSheet: async (cycleId) => {
    const response = await api.get(`/goals/sheet?cycleId=${cycleId}`);
    return response.data;
  },

  /**
   * Add a single Strategic Goal to the current sheet
   */
  createGoal: async (goalData) => {
    const response = await api.post('/goals', goalData);
    return response.data;
  },

  /**
   * Update specific goal (Quarterly Status, Achievements, or Metrics)
   */
  updateGoal: async (goalId, updateData) => {
    const response = await api.put(`/goals/${goalId}`, updateData);
    return response.data;
  },

  /**
   * Remove a goal from the operational grid
   */
  deleteGoal: async (goalId) => {
    const response = await api.delete(`/goals/${goalId}`);
    return response.data;
  },

  /**
   * Submit full sheet for Managerial Validation (Triggers 100% weightage check)
   */
  submitGoalSheet: async (sheetId) => {
    const response = await api.put(`/goals/sheet/submit/${sheetId}`);
    return response.data;
  },

  // ==========================================
  // 2. BULK & SPECIALIZED UPDATES
  // ==========================================

  /**
   * Bulk Progress Update (From your original logic)
   * Useful for "Check-in" dashboards where multiple goals are updated at once.
   */
  updateBulkProgress: async (progressUpdates) => {
    // progressUpdates: [{ goalId, qAchievement, qStatus }]
    const response = await api.patch('/goals/progress/bulk', { updates: progressUpdates });
    return response.data;
  },

  // ==========================================
  // 3. MANAGERIAL / ADMIN OPERATIONS
  // ==========================================

  /**
   * Review and Approve/Reject a subordinate's sheet
   * @param {string} sheetId - Target sheet ID
   * @param {string} status - 'Approved' | 'Rejected'
   * @param {string} feedback - Managerial notes
   */
  reviewGoalSheet: async (sheetId, status, feedback) => {
    const response = await api.patch(`/management/review/${sheetId}`, { status, feedback });
    return response.data;
  }
};

export default goalService;