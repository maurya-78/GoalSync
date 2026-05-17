const User = require('../models/User');
const GoalSheet = require('../models/GoalSheet');
const AuditLog = require('../models/AuditLog');
const GoalCycle = require('../models/GoalCycle');

exports.getSystemAuditLogs = async (req, res, next) => {
  try {
    const logs = await AuditLog.find().populate('performedBy').sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) { next(error); }
};

exports.forceUnlockGoalSheet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sheet = await GoalSheet.findById(id);
    if (!sheet) { res.status(404); throw new Error('Target document signature payload error.'); }
    
    sheet.isLocked = false;
    sheet.status = 'Draft';
    await sheet.save();

    await AuditLog.create({
      performedBy: req.user._id, action: 'ADMIN_FORCE_UNLOCK', entityType: 'GoalSheet', entityId: id, newValue: sheet
    });

    res.json({ message: 'Administrative explicit lock override sequence authorized.', sheet });
  } catch (error) { next(error); }
};

exports.getGlobalEnterpriseReport = async (req, res, next) => {
  try {
    const criticalSheetsCount = await GoalSheet.countDocuments({ status: 'Approved' });
    const outstandingSheetsCount = await GoalSheet.countDocuments({ status: 'Pending Approval' });
    const draftSheetsCount = await GoalSheet.countDocuments({ status: 'Draft' });
    res.json({ criticalSheetsCount, outstandingSheetsCount, draftSheetsCount });
  } catch (error) { next(error); }
};

exports.createGoalCycle = async (req, res, next) => {
  try {
    const { name, startDate, endDate } = req.body;
    const cycle = await GoalCycle.create({ name, startDate, endDate });
    res.status(201).json(cycle);
  } catch (error) { next(error); }
};

exports.getGoalCycles = async (req, res, next) => {
  try {
    const cycles = await GoalCycle.find();
    res.json(cycles);
  } catch (error) { next(error); }
};