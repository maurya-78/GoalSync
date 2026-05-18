const User = require('../models/User');
const Goal = require('../models/Goal');
const { Cycle, Team, Department } = require('../models/index');

// ─── User Management ────────────────────────────────────────────────────────
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .populate('department', 'name')
      .populate('team', 'name')
      .populate('manager', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, users });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const allowedFields = ['name', 'role', 'isActive', 'department', 'team', 'manager', 'designation', 'phone'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.status(200).json({ success: true, user });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.role === 'admin') return res.status(403).json({ success: false, message: 'Cannot delete admin' });
    await user.deleteOne();
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (err) { next(err); }
};

// ─── Cycle Management ───────────────────────────────────────────────────────
exports.getCycles = async (req, res, next) => {
  try {
    const cycles = await Cycle.find().sort({ year: -1 });
    res.status(200).json({ success: true, cycles });
  } catch (err) { next(err); }
};

exports.createCycle = async (req, res, next) => {
  try {
    req.body.createdBy = req.user.id;
    const cycle = await Cycle.create(req.body);
    res.status(201).json({ success: true, cycle });
  } catch (err) { next(err); }
};

exports.updateCycle = async (req, res, next) => {
  try {
    if (req.body.isActive) await Cycle.updateMany({}, { isActive: false });
    const cycle = await Cycle.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, cycle });
  } catch (err) { next(err); }
};

exports.deleteCycle = async (req, res, next) => {
  try {
    await Cycle.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Cycle deleted' });
  } catch (err) { next(err); }
};

// ─── Department Management ──────────────────────────────────────────────────
exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await Department.find().populate('head', 'name email');
    res.status(200).json({ success: true, departments });
  } catch (err) { next(err); }
};

exports.createDepartment = async (req, res, next) => {
  try {
    const dept = await Department.create(req.body);
    res.status(201).json({ success: true, department: dept });
  } catch (err) { next(err); }
};

exports.updateDepartment = async (req, res, next) => {
  try {
    const dept = await Department.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, department: dept });
  } catch (err) { next(err); }
};

exports.deleteDepartment = async (req, res, next) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Department deleted' });
  } catch (err) { next(err); }
};

// ─── Team Management ────────────────────────────────────────────────────────
exports.getTeams = async (req, res, next) => {
  try {
    const teams = await Team.find()
      .populate('manager', 'name email avatar')
      .populate('members', 'name email avatar')
      .populate('department', 'name');
    res.status(200).json({ success: true, teams });
  } catch (err) { next(err); }
};

exports.createTeam = async (req, res, next) => {
  try {
    const team = await Team.create(req.body);
    res.status(201).json({ success: true, team });
  } catch (err) { next(err); }
};

exports.updateTeam = async (req, res, next) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, team });
  } catch (err) { next(err); }
};

exports.deleteTeam = async (req, res, next) => {
  try {
    await Team.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Team deleted' });
  } catch (err) { next(err); }
};

// ─── System Analytics ───────────────────────────────────────────────────────
exports.getSystemAnalytics = async (req, res, next) => {
  try {
    const [totalUsers, totalGoals, activeGoals, usersByRole, goalsByStatus] = await Promise.all([
      User.countDocuments(),
      Goal.countDocuments(),
      Goal.countDocuments({ status: 'in_progress' }),
      User.aggregate([{ $group: { _id: '$role', count: { $sum: 1 } } }]),
      Goal.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    ]);
    res.status(200).json({
      success: true,
      analytics: { totalUsers, totalGoals, activeGoals, usersByRole, goalsByStatus },
    });
  } catch (err) { next(err); }
};