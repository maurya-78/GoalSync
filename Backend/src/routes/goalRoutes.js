// ==========================================
// FILE: src/routes/goalRoutes.js
// ==========================================

const express = require('express');

const router = express.Router();

// ==========================================
// CONTROLLERS
// ==========================================

const {

  fetchGoals,
  getOrCreateGoalSheet,
  addGoal,
  updateGoal,
  deleteGoal,
  updateQuarterlyProgress,
  submitGoalSheet

} = require('../controllers/goalController');

// ==========================================
// MIDDLEWARES
// ==========================================

const {

  protect

} = require('../middleware/authMiddleware');

const {

  validateGoal

} = require('../middleware/goalValidation');

// ==========================================
// ALL ROUTES ARE PROTECTED
// ==========================================

router.use(protect);

// ==========================================
// GOALSHEET ROUTES
// ==========================================

/**
 * @route   GET /api/v1/goals
 * @desc    Fetch all employee goals
 * @access  Private
 */
router.get(

  '/',

  fetchGoals

);

/**
 * @route   GET /api/v1/goals/sheet
 * @desc    Get or create employee goal sheet
 * @access  Private
 */
router.get(

  '/sheet',

  getOrCreateGoalSheet

);

/**
 * @route   PUT /api/v1/goals/sheet/submit/:id
 * @desc    Submit goal sheet for approval
 * @access  Private
 */
router.put(

  '/sheet/submit/:id',

  submitGoalSheet

);

// ==========================================
// GOAL CRUD ROUTES
// ==========================================

/**
 * @route   POST /api/v1/goals
 * @desc    Create new goal
 * @access  Private
 */
router.post(

  '/',

  validateGoal,

  addGoal

);

/**
 * @route   PUT /api/v1/goals/:id
 * @desc    Update complete goal
 * @access  Private
 */
router.put(

  '/:id',

  validateGoal,

  updateGoal

);

/**
 * @route   PATCH /api/v1/goals/:id/progress
 * @desc    Update quarterly progress only
 * @access  Private
 */
router.patch(

  '/:id/progress',

  updateQuarterlyProgress

);

/**
 * @route   DELETE /api/v1/goals/:id
 * @desc    Delete goal
 * @access  Private
 */
router.delete(

  '/:id',

  deleteGoal

);

module.exports = router;