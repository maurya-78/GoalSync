const express = require('express');
const router = express.Router();
const { getSystemAuditLogs, forceUnlockGoalSheet, getGlobalEnterpriseReport, createGoalCycle, getGoalCycles } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/audit-logs', protect, authorize('Admin'), getSystemAuditLogs);
router.put('/unlock/:id', protect, authorize('Admin'), forceUnlockGoalSheet);
router.get('/metrics-report', protect, authorize('Admin'), getGlobalEnterpriseReport);
router.post('/cycles', protect, authorize('Admin'), createGoalCycle);
router.get('/cycles', protect, getGoalCycles);

module.exports = router;