const express = require('express');
const router = express.Router();

// Controllers import
const { 
  createCycle, 
  getCycles, 
  getActiveCycle, 
  updateCycle, 
  deleteCycle 
} = require('../controllers/cycleController');

// Middleware import
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * STRATEGIC CYCLE MANAGEMENT ROUTES
 * ---------------------------------
 * Base Path: /api/v1/cycles
 */

// 1. PUBLIC/SHARED OPERATIONAL ROUTES
// Sabhi authenticated users active cycle dekh sakte hain dashboard ke liye
router.get('/active', protect, getActiveCycle);

// 2. ADMINISTRATIVE CONTROL ROUTES
// Sirf Admin hi cycles ko manage (CRUD) kar sakta hai
router.use(protect); // Sabhi routes protected hain

router
  .route('/')
  .get(getCycles) // List all cycles (FY 2024, 2025, 2026...)
  .post(authorize('Admin'), createCycle); // Start a new performance period

router
  .route('/:id')
  .put(authorize('Admin'), updateCycle)   // Archive or lock a cycle
  .delete(authorize('Admin'), deleteCycle); // Purge inactive cycles

module.exports = router;