const GoalSheet = require('../models/GoalSheet');
const Goal = require('../models/Goal');
const AuditLog = require('../models/AuditLog');
const Notification = require('../models/Notification');

/**
 * 1. GET OR CREATE GOAL SHEET
 * Fetch existing sheet for the cycle or initialize a new operational grid.
 */
exports.getOrCreateGoalSheet = async (req, res, next) => {
  try {
    const employeeId = req.user._id;
    const { cycleId } = req.query;

    if (!cycleId) {
      return res.status(400).json({ message: 'Active corporate cycle parameters must be specified.' });
    }

    let sheet = await GoalSheet.findOne({ employee: employeeId, cycle: cycleId });
    if (!sheet) {
      sheet = await GoalSheet.create({ employee: employeeId, cycle: cycleId, totalWeightage: 0 });
    }

    const goals = await Goal.find({ goalSheet: sheet._id });
    res.json({ sheet, goals });
  } catch (error) { next(error); }
};

/**
 * 2. ADD STRATEGIC GOAL
 * Adds a new target vector with weightage and count constraints.
 */
exports.addGoal = async (req, res, next) => {
  try {
    const { goalSheetId, title, description, weightage, target } = req.body;
    const sheet = await GoalSheet.findById(goalSheetId);

    if (!sheet) throw new Error('Goal sheet record missing.');
    if (sheet.isLocked) throw new Error('Target matrix is explicitly locked.');

    const goalsCount = await Goal.countDocuments({ goalSheet: goalSheetId });
    if (goalsCount >= 8) throw new Error('Business limitation: maximum 8 active strategic targets.');

    if (sheet.totalWeightage + Number(weightage) > 100) {
      throw new Error('Weightage aggregation violation: sum exceeds 100%.');
    }

    // Creating goal using merged model structure
    const goal = await Goal.create({ 
      goalSheet: goalSheetId, 
      title, 
      description, 
      weightage, 
      target 
    });

    sheet.totalWeightage += Number(weightage);
    await sheet.save();

    await AuditLog.create({
      performedBy: req.user._id, action: 'GOAL_CREATE', entityType: 'Goal', entityId: goal._id, newValue: goal
    });

    res.status(201).json(goal);
  } catch (error) { next(error); }
};

/**
 * 3. UPDATE GOAL (With Business Logic & Telemetry)
 */
exports.updateGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = req.body; // Contains weightage, quarterly status/achievement, etc.
    
    const goal = await Goal.findById(id);
    if (!goal) throw new Error('Goal target entity lookup failure.');
    
    const sheet = await GoalSheet.findById(goal.goalSheet);
    const originalGoalData = goal.toObject();

    if (sheet.isLocked && req.user.role === 'Employee') {
      throw new Error('Operational denial: target vectors are structurally locked.');
    }

    // Role-based editing restrictions
    if (req.user.role === 'Employee') {
        const weightDelta = Number(updateData.weightage || goal.weightage) - goal.weightage;
        if (sheet.totalWeightage + weightDelta > 100) throw new Error('Weightage ceiling constraint hit.');
        
        if (!goal.isShared) {
            goal.title = updateData.title || goal.title;
            goal.description = updateData.description || goal.description;
            goal.target = updateData.target || goal.target;
        }
        goal.weightage = updateData.weightage || goal.weightage;
    } else {
        // Manager/Admin Overrides
        if (updateData.weightage) {
            const weightDelta = Number(updateData.weightage) - goal.weightage;
            if (sheet.totalWeightage + weightDelta > 100) throw new Error('Weightage structural override limits blown.');
            goal.weightage = updateData.weightage;
        }
        if (updateData.title && !goal.isShared) goal.title = updateData.title;
        if (updateData.target) goal.target = updateData.target;
    }

    // SYNCING WITH MERGED MODEL QUARTERLY STRUCTURE
    // Processing Q1 - Q4 Status and Achievement
    ['q1', 'q2', 'q3', 'q4'].forEach(q => {
        if (updateData[`${q}Status`]) goal[q].status = updateData[`${q}Status`];
        if (updateData[`${q}Achievement`] !== undefined) goal[q].achievement = updateData[`${q}Achievement`];
    });

    // Recalculate Overall Progress
    goal.overallProgress = Math.round((goal.q1.achievement + goal.q2.achievement + goal.q3.achievement + goal.q4.achievement) / 4);
    
    await goal.save();

    // Sync Sheet Total Weightage
    const allGoals = await Goal.find({ goalSheet: sheet._id });
    sheet.totalWeightage = allGoals.reduce((sum, g) => sum + g.weightage, 0);
    await sheet.save();

    await AuditLog.create({
      performedBy: req.user._id, action: 'GOAL_UPDATE', entityType: 'Goal', entityId: goal._id, previousValue: originalGoalData, newValue: goal
    });

    res.json(goal);
  } catch (error) { next(error); }
};

/**
 * 4. DELETE GOAL
 */
exports.deleteGoal = async (req, res, next) => {
  try {
    const { id } = req.params;
    const goal = await Goal.findById(id);
    if (!goal) throw new Error('Target matrix identity reference breakdown.');
    
    const sheet = await GoalSheet.findById(goal.goalSheet);
    if (sheet.isLocked) throw new Error('Destruction request locked out.');

    sheet.totalWeightage -= goal.weightage;
    await sheet.save();
    
    await Goal.findByIdAndDelete(id);

    await AuditLog.create({
      performedBy: req.user._id, action: 'GOAL_DELETE', entityType: 'Goal', entityId: id, previousValue: goal
    });

    res.json({ message: 'Target node purge complete.' });
  } catch (error) { next(error); }
};

/**
 * 5. SUBMIT GOAL SHEET (Validation & Notification)
 */
exports.submitGoalSheet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const sheet = await GoalSheet.findById(id).populate('employee');
    
    if (!sheet) throw new Error('Target matrix catalog configuration missing.');
    if (sheet.totalWeightage !== 100) {
      throw new Error(`Strategic validation barrier: Cumulative metric weightage must equal exactly 100%. Current total: ${sheet.totalWeightage}%`);
    }

    const goals = await Goal.find({ goalSheet: id });
    if (goals.some(g => g.weightage < 10)) {
      throw new Error('Policy infraction: Individual target metrics cannot drop below 10% structural allocation.');
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