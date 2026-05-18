const express = require('express');
const router = express.Router();
const {
  createGoal, getGoals, getGoal, updateGoal, deleteGoal, reviewGoal, getAnalytics,
} = require('../controllers/goalController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/analytics', getAnalytics);
router.route('/').get(getGoals).post(createGoal);
router.route('/:id').get(getGoal).put(updateGoal).delete(deleteGoal);
router.put('/:id/review', authorize('manager', 'admin'), reviewGoal);

module.exports = router;