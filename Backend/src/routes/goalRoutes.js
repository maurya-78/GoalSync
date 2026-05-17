const express = require('express');
const router = express.Router();

// Controllers import
const { 
  getOrCreateGoalSheet, 
  addGoal, 
  updateGoal, 
  deleteGoal, 
  submitGoalSheet 
} = require('../controllers/goalController');

// Middleware import
const { protect } = require('../middleware/authMiddleware');

/**
 * GOAL MANAGEMENT SYSTEM ROUTES
 * -----------------------------
 * All routes are guarded by 'protect' middleware.
 */

// 1. GoalSheet Operations
// GET /api/v1/goals/sheet -> Fetch or initialize the user's current sheet
router.get('/sheet', protect, getOrCreateGoalSheet);

// PUT /api/v1/goals/sheet/submit/:id -> Final validation & lock the sheet
// (Using PUT because we are updating the full state of the sheet to 'Submitted')
router.put('/sheet/submit/:id', protect, submitGoalSheet);

// 2. Individual Goal Operations
// POST /api/v1/goals -> Create a new strategic target inside a sheet
router.post('/', protect, addGoal);

// ID Specific Operations (Update & Delete)
router
  .route('/:id')
  .put(protect, updateGoal)    // Update metrics/achievement (Merged choice)
  .delete(protect, deleteGoal); // Purge target (checks for sheet lock status)

module.exports = router;