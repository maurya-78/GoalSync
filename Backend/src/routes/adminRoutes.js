const express = require('express');
const router = express.Router();
const {
  getAllUsers, updateUser, deleteUser,
  getCycles, createCycle, updateCycle, deleteCycle,
  getDepartments, createDepartment, updateDepartment, deleteDepartment,
  getTeams, createTeam, updateTeam, deleteTeam,
  getSystemAnalytics,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.use(protect, authorize('admin'));

router.get('/analytics', getSystemAnalytics);
router.route('/users').get(getAllUsers);
router.route('/users/:id').put(updateUser).delete(deleteUser);
router.route('/cycles').get(getCycles).post(createCycle);
router.route('/cycles/:id').put(updateCycle).delete(deleteCycle);
router.route('/departments').get(getDepartments).post(createDepartment);
router.route('/departments/:id').put(updateDepartment).delete(deleteDepartment);
router.route('/teams').get(getTeams).post(createTeam);
router.route('/teams/:id').put(updateTeam).delete(deleteTeam);

module.exports = router;