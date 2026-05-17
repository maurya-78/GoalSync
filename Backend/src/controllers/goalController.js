const Goal = require('../models/Goal');

const GoalSheet = require('../models/GoalSheet');

const AuditLog = require('../models/AuditLog');

const Notification = require('../models/Notification');

const goalService = require('../services/goalService');

/**
 * ==========================================
 * 1. FETCH EMPLOYEE GOALS
 * ==========================================
 */

exports.fetchGoals = async (

  req,
  res,
  next

) => {

  try {

    const { cycleId } = req.query;

    const data = await goalService.getEmployeeGoals(

      req.user._id,

      cycleId

    );

    res.status(200).json({

      success: true,

      ...data

    });

  } catch (error) {

    next(error);

  }

};

/**
 * ==========================================
 * 2. GET OR CREATE GOAL SHEET
 * ==========================================
 */

exports.getOrCreateGoalSheet = async (

  req,
  res,
  next

) => {

  try {

    const employeeId = req.user._id;

    const { cycleId } = req.query;

    if (!cycleId) {

      return res.status(400).json({

        success: false,

        message: 'Cycle ID is required.'

      });

    }

    let sheet = await GoalSheet.findOne({

      employee: employeeId,

      cycle: cycleId

    });

    // ==========================================
    // CREATE SHEET IF NOT EXISTS
    // ==========================================

    if (!sheet) {

      sheet = await GoalSheet.create({

        employee: employeeId,

        cycle: cycleId,

        totalWeightage: 0,

        status: 'Draft',

        isLocked: false

      });

    }

    // ==========================================
    // FETCH GOALS
    // ==========================================

    const goals = await Goal.find({

      goalSheet: sheet._id

    });

    res.status(200).json({

      success: true,

      sheet,

      goals

    });

  } catch (error) {

    next(error);

  }

};

/**
 * ==========================================
 * 3. CREATE GOAL
 * ==========================================
 */

exports.addGoal = async (

  req,
  res,
  next

) => {

  try {

    const {

      goalSheetId,

      title,

      description,

      weightage,

      target

    } = req.body;

    // ==========================================
    // FIND SHEET
    // ==========================================

    const sheet = await GoalSheet.findById(

      goalSheetId

    );

    if (!sheet) {

      return res.status(404).json({

        success: false,

        message: 'Goal sheet not found.'

      });

    }

    // ==========================================
    // SHEET LOCK CHECK
    // ==========================================

    if (sheet.isLocked) {

      return res.status(400).json({

        success: false,

        message: 'Goal sheet is locked.'

      });

    }

    // ==========================================
    // MAX GOALS CHECK
    // ==========================================

    const goalsCount = await Goal.countDocuments({

      goalSheet: goalSheetId

    });

    if (goalsCount >= 8) {

      return res.status(400).json({

        success: false,

        message: 'Maximum 8 goals allowed.'

      });

    }

    // ==========================================
    // WEIGHTAGE VALIDATION
    // ==========================================

    const existingGoals = await Goal.find({

      goalSheet: goalSheetId

    });

    const totalWeightage = existingGoals.reduce(

      (sum, goal) => sum + goal.weightage,

      0

    );

    if (

      totalWeightage +

      Number(weightage) >

      100

    ) {

      return res.status(400).json({

        success: false,

        message:

          'Total weightage cannot exceed 100%.'

      });

    }

    // ==========================================
    // CREATE GOAL
    // ==========================================

    const goal = await Goal.create({

      user: req.user._id,

      goalSheet: goalSheetId,

      title,

      description,

      weightage,

      target

    });

    // ==========================================
    // UPDATE SHEET WEIGHTAGE
    // ==========================================

    sheet.totalWeightage += Number(weightage);

    await sheet.save();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await AuditLog.create({

      performedBy: req.user._id,

      action: 'GOAL_CREATE',

      entityType: 'Goal',

      entityId: goal._id,

      newValue: goal

    });

    res.status(201).json({

      success: true,

      data: goal

    });

  } catch (error) {

    next(error);

  }

};

/**
 * ==========================================
 * 4. UPDATE GOAL
 * ==========================================
 */

exports.updateGoal = async (

  req,
  res,
  next

) => {

  try {

    const { id } = req.params;

    const goal = await Goal.findById(id);

    if (!goal) {

      return res.status(404).json({

        success: false,

        message: 'Goal not found.'

      });

    }

    // ==========================================
    // SECURITY CHECK
    // ==========================================

    if (

      goal.user.toString() !==

      req.user._id.toString() &&

      req.user.role === 'Employee'

    ) {

      return res.status(403).json({

        success: false,

        message: 'Unauthorized access.'

      });

    }

    const sheet = await GoalSheet.findById(

      goal.goalSheet

    );

    if (

      sheet.isLocked &&

      req.user.role === 'Employee'

    ) {

      return res.status(400).json({

        success: false,

        message: 'Goal sheet locked.'

      });

    }

    const oldWeightage = goal.weightage;

    // ==========================================
    // BASIC FIELD UPDATES
    // ==========================================

    goal.title =
      req.body.title || goal.title;

    goal.description =
      req.body.description || goal.description;

    goal.target =
      req.body.target || goal.target;

    goal.weightage =
      req.body.weightage || goal.weightage;

    // ==========================================
    // QUARTERLY UPDATES
    // ==========================================

    ['q1', 'q2', 'q3', 'q4']

      .forEach((quarter) => {

        if (req.body[quarter]) {

          goal[quarter].status =

            req.body[quarter].status ||

            goal[quarter].status;

          goal[quarter].achievement =

            req.body[quarter].achievement ??

            goal[quarter].achievement;

        }

      });

    // ==========================================
    // OVERALL PROGRESS
    // ==========================================

    goal.overallProgress = Math.round(

      (

        goal.q1.achievement +

        goal.q2.achievement +

        goal.q3.achievement +

        goal.q4.achievement

      ) / 4

    );

    await goal.save();

    // ==========================================
    // UPDATE SHEET WEIGHTAGE
    // ==========================================

    sheet.totalWeightage =

      sheet.totalWeightage -

      oldWeightage +

      goal.weightage;

    if (sheet.totalWeightage > 100) {

      return res.status(400).json({

        success: false,

        message:

          'Weightage exceeds 100%.'

      });

    }

    await sheet.save();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await AuditLog.create({

      performedBy: req.user._id,

      action: 'GOAL_UPDATE',

      entityType: 'Goal',

      entityId: goal._id,

      newValue: goal

    });

    res.status(200).json({

      success: true,

      data: goal

    });

  } catch (error) {

    next(error);

  }

};

/**
 * ==========================================
 * 5. UPDATE QUARTERLY PROGRESS
 * ==========================================
 */

exports.updateQuarterlyProgress = async (

  req,
  res,
  next

) => {

  try {

    const { id } = req.params;

    const goal = await Goal.findById(id);

    if (!goal) {

      return res.status(404).json({

        success: false,

        message: 'Goal not found.'

      });

    }

    // ==========================================
    // SECURITY CHECK
    // ==========================================

    if (

      goal.user.toString() !==

      req.user._id.toString()

    ) {

      return res.status(403).json({

        success: false,

        message: 'Unauthorized access.'

      });

    }

    const updates = req.body;

    // ==========================================
    // QUARTER UPDATE
    // ==========================================

    ['q1', 'q2', 'q3', 'q4']

      .forEach((quarter) => {

        if (updates[quarter]) {

          goal[quarter].status =

            updates[quarter].status ||

            goal[quarter].status;

          goal[quarter].achievement =

            updates[quarter].achievement ??

            goal[quarter].achievement;

        }

      });

    // ==========================================
    // OVERALL PROGRESS
    // ==========================================

    goal.overallProgress = Math.round(

      (

        goal.q1.achievement +

        goal.q2.achievement +

        goal.q3.achievement +

        goal.q4.achievement

      ) / 4

    );

    await goal.save();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await AuditLog.create({

      performedBy: req.user._id,

      action: 'GOAL_PROGRESS_UPDATE',

      entityType: 'Goal',

      entityId: goal._id,

      newValue: goal

    });

    res.status(200).json({

      success: true,

      data: goal

    });

  } catch (error) {

    next(error);

  }

};

/**
 * ==========================================
 * 6. DELETE GOAL
 * ==========================================
 */

exports.deleteGoal = async (

  req,
  res,
  next

) => {

  try {

    const goal = await Goal.findOne({

      _id: req.params.id,

      user: req.user._id

    });

    if (!goal) {

      return res.status(404).json({

        success: false,

        message: 'Goal not found.'

      });

    }

    const sheet = await GoalSheet.findById(

      goal.goalSheet

    );

    if (sheet.isLocked) {

      return res.status(400).json({

        success: false,

        message: 'Goal sheet locked.'

      });

    }

    sheet.totalWeightage -= goal.weightage;

    await sheet.save();

    await goal.deleteOne();

    // ==========================================
    // AUDIT LOG
    // ==========================================

    await AuditLog.create({

      performedBy: req.user._id,

      action: 'GOAL_DELETE',

      entityType: 'Goal',

      entityId: goal._id

    });

    res.status(200).json({

      success: true,

      message: 'Goal deleted successfully.'

    });

  } catch (error) {

    next(error);

  }

};

/**
 * ==========================================
 * 7. SUBMIT GOAL SHEET
 * ==========================================
 */

exports.submitGoalSheet = async (

  req,
  res,
  next

) => {

  try {

    const { id } = req.params;

    const sheet = await GoalSheet.findById(id)

      .populate('employee');

    if (!sheet) {

      return res.status(404).json({

        success: false,

        message: 'Goal sheet not found.'

      });

    }

    // ==========================================
    // FINAL VALIDATION
    // ==========================================

    if (sheet.totalWeightage !== 100) {

      return res.status(400).json({

        success: false,

        message:
          'Total weightage must equal 100%.'

      });

    }

    sheet.status = 'Pending Approval';

    await sheet.save();

    // ==========================================
    // MANAGER NOTIFICATION
    // ==========================================

    if (sheet.employee.manager) {

      await Notification.create({

        recipient: sheet.employee.manager,

        title: 'Goal Sheet Pending',

        message:
          `${sheet.employee.name} submitted goals for approval.`

      });

    }

    res.status(200).json({

      success: true,

      sheet

    });

  } catch (error) {

    next(error);

  }

};