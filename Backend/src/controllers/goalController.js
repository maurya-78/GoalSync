const GoalSheet = require('../models/GoalSheet');
const Goal = require('../models/Goal');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

exports.getOrCreateGoalSheet = async (req, res, next) => {
  try {
    const employeeId = req.user._id;
    const { cycleId } = req.query;
    if (!cycleId) {
      res.status(400);
      throw new Error('Active corporate cycle parameters must be specified.');
    }
    let sheet = await GoalSheet.findOne({ employee: employeeId, cycle: cycleId });
    if (!sheet) {
      sheet = await GoalSheet.create({ employee: employeeId, cycle: cycleId, totalWeightage: 0 });
    }
    const goals = await Goal.find({ goalSheet: sheet._id });
    res.json({ sheet, goals });
  } catch (error) { next(error); }
};

exports.addGoal = async (req, res, next) => {
  try {
    const { goalSheetId, title, description, weightage, target } = req.body;
    const sheet = await GoalSheet.findById(goalSheetId);
    if (!sheet) { res.status(404); throw new Error('Goal sheet record missing.'); }
    if (sheet.isLocked) { res.status(400); throw new Error('Target matrix is explicitly locked.'); }

    const goalsCount = await Goal.countDocuments({ goalSheet: goalSheetId });
    if (goalsCount >= 8) { res.status(400); throw new Error('Business limitation: maximum 8 active strategic targets.'); }

    if (sheet.totalWeightage + Number(weightage) > 100) {
      res.status(400); throw new Error('Weightage aggregation violation: sum exceeds 100%.');
    }

    const goal = await Goal.create({ goalSheet: goalSheetId, title, description, weightage, target });
    sheet.totalWeightage += Number(weightage);
    await sheet.save();

    await AuditLog.create({
      performedBy: req.user._id, action: 'GOAL_CREATE', entityType: 'Goal', entityId: goal._id, newValue: goal
    });

    res.status(201).json(goal);
  } catch (error) { next(error); }
};

exports.updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, weightage, target, q1Status, q2Status, q3Status, q4Status, q1Achievement, q2Achievement, q3Achievement, q4Achievement } = req.body;
    
    const goal = await Goal.findById(id);
    if (!goal) { res.status(404); throw new Error('Goal target entity lookup failure.'); }
    
    const sheet = await GoalSheet.findById(goal.goalSheet);
    const originalGoalData = goal.toObject();

    if (sheet.isLocked && req.user.role === 'Employee') {
      res.status(400); throw new Error('Operational denial: target vectors are structurally locked.');
    }

    if (req.user.role === 'Employee') {
      if (goal.isShared) {
        // Shared logic restriction
        const weightDelta = Number(weightage) - goal.weightage;
        if (sheet.totalWeightage + weightDelta > 100) { res.status(400); throw new Error('Weightage ceiling constraint hit.'); }
        goal.weightage = weightage;
      } else {
        const weightDelta = Number(weightage) - goal.weightage;
        if (sheet.totalWeightage + weightDelta > 100) { res.status(400); throw new Error('Weightage ceiling constraint hit.'); }
        goal.title = title || goal.title;
        goal.description = description || goal.description;
        goal.weightage = weightage || goal.weightage;
        goal.target = target || goal.target;
      }
    } else {
      // Manager/Admin baseline update bypass
      if (weightage) {
        const weightDelta = Number(weightage) - goal.weightage;
        if (sheet.totalWeightage + weightDelta > 100) { res.status(400); throw new Error('Weightage structural override limits blown.'); }
        goal.weightage = weightage;
      }
      if (title && !goal.isShared) goal.title = title;
      if (description && !goal.isShared) goal.description = description;
      if (target) goal.target = target;
    }

    // Process check-in update parameters safely
    if (q1Status) goal.q1Status = q1Status;
    if (q2Status) goal.q2Status = q2Status;
    if (q3Status) goal.q3Status = q3Status;
    if (q4Status) goal.q4Status = q4Status;
    if (q1Achievement !== undefined) goal.q1Achievement = q1Achievement;
    if (q2Achievement !== undefined) goal.q2Achievement = q2Achievement;
    if (q3Achievement !== undefined) goal.q3Achievement = q3Achievement;
    if (q4Achievement !== undefined) goal.q4Achievement = q4Achievement;

    goal.overallProgress = Math.round((goal.q1Achievement + goal.q2Achievement + goal.q3Achievement + goal.q4Achievement) / 4);
    await goal.save();

    // Recalculate operational matrix weights
    const allGoals = await Goal.find({ goalSheet: sheet._id });
    sheet.totalWeightage = allGoals.reduce((sum, g) => sum + g.weightage, 0);
    await sheet.save();

    await AuditLog.create({
      performedBy: req.user._id, action: 'GOAL_UPDATE', entityType: 'Goal', entityId: goal._id, previousValue: originalGoalData, newValue: goal
    });

    res.json(goal);
  } catch (error) { next(error); }
};

exports.deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) { res.status(404); throw new Error('Target matrix identity reference breakdown.'); }
    const sheet = await GoalSheet.findById(goal.goalSheet);
    if (sheet.isLocked) { res.status(400); throw new Error('Destruction request locked out.'); }

    sheet.totalWeightage -= goal.weightage;
    await sheet.save();
    await Goal.findByIdAndDelete(id);

    await AuditLog.create({
      performedBy: req.user._id, action: 'GOAL_DELETE', entityType: 'Goal', entityId: id, previousValue: goal
    });

    res.json({ message: 'Target node purge complete.' });
  } catch (error) { next(error); }
};

exports.submitGoalSheet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sheet = await GoalSheet.findById(id).populate('employee');
    if (!sheet) { res.status(404); throw new Error('Target matrix catalog configuration missing.'); }
    if (sheet.totalWeightage !== 100) {
      res.status(400); throw new Error(`Strategic validation barrier: Cumulative metric weightage must equal exactly 100%. Current total: ${sheet.totalWeightage}%`);
    }

    const minGoalCheck = await Goal.find({ goalSheet: id });
    if (minGoalCheck.some(g => g.weightage < 10)) {
      res.status(400); throw new Error('Policy infraction: Individual target metrics cannot drop below 10% structural allocation.');
    }

    sheet.status = 'Pending Approval';
    await sheet.save();

    if (sheet.employee.manager) {
      await Notification.create({
        recipient: sheet.employee.manager,
        title: 'Goal Matrix Pending Review',
        message: `${sheet.employee.name} has submitted a core corporate strategy matrix for review alignment.`
      });
    }

    res.json({ message: 'Strategic operational targets staged for managerial validation.', sheet });
  } catch (error) { next(error); }
};