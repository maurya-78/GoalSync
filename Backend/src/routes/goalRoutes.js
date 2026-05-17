const express = require('express');
const router = express.Router();
const { getOrCreateGoalSheet, addGoal, updateGoal, deleteGoal, submitGoalSheet } = require('../controllers/goalController');
const { protect } = require('../middleware/authMiddleware');

router.get('/sheet', protect, getOrCreateGoalSheet);
router.post('/', protect, addGoal);
router.put('/:id', protect, updateGoal);
router.delete('/:id', protect, deleteGoal);
router.put('/sheet/submit/:id', protect, submitGoalSheet);

module.exports = router;