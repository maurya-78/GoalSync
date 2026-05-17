const express = require('express');
const router = express.Router();
const { 
    getTeamDashboard, 
    reviewGoalSheet, 
    assignSharedGoal 
} = require('../controllers/managementController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * @description Get all team members and their goal sheet statuses
 * @access Private (Manager/Admin only)
 */
router.get('/dashboard', protect, authorize('Manager', 'Admin'), getTeamDashboard);

/**
 * @description Approve or Reject an employee's goal sheet
 * @access Private (Manager/Admin only)
 */
router.put('/review/:id', protect, authorize('Manager', 'Admin'), reviewGoalSheet);

/**
 * @description Assign a read-only shared goal to an entire team
 * @access Private (Manager/Admin only)
 */
router.post('/shared', protect, authorize('Manager', 'Admin'), assignSharedGoal);

module.exports = router;