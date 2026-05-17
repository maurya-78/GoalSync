const GoalSheet = require('../models/GoalSheet');

const Goal = require('../models/Goal');

const Notification = require('../models/Notification');

const User = require('../models/User');

// ==========================================
// TEAM DASHBOARD
// ==========================================

exports.getTeamDashboard = async (

  req,
  res,
  next

) => {

  try {

    // ==========================================
    // FETCH TEAM MEMBERS
    // ==========================================

    const teamMembers = await User.find({

      manager: req.user._id

    })

      .populate('department')

      .populate('team')

      .select('-password');

    const memberIds =

      teamMembers.map(

        member => member._id

      );

    // ==========================================
    // FETCH SHEETS + GOALS
    // ==========================================

    const sheets = await GoalSheet.find({

      employee: {

        $in: memberIds

      }

    })

      .populate('employee')

      .populate('cycle');

    // ==========================================
    // FETCH GOALS
    // ==========================================

    const goals = await Goal.find({

      goalSheet: {

        $in: sheets.map(
          s => s._id
        )

      }

    });

    // ==========================================
    // ANALYTICS
    // ==========================================

    const totalGoals = goals.length;

    const completedGoals =

      goals.filter(

        g => g.overallProgress >= 100

      ).length;

    const delayedGoals =

      goals.filter(

        g =>

          g.q1?.status === 'Delayed' ||

          g.q2?.status === 'Delayed' ||

          g.q3?.status === 'Delayed' ||

          g.q4?.status === 'Delayed'

      ).length;

    const completionRate =

      totalGoals > 0

        ? Math.round(

            (
              completedGoals /

              totalGoals

            ) * 100

          )

        : 0;

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({

      success: true,

      analytics: {

        totalEmployees:

          teamMembers.length,

        totalGoals,

        completedGoals,

        delayedGoals,

        completionRate

      },

      teamMembers,

      sheets,

      goals

    });

  } catch (error) {

    next(error);

  }

};

// ==========================================
// REVIEW GOAL SHEET
// ==========================================

exports.reviewGoalSheet = async (

  req,
  res,
  next

) => {

  try {

    const { id } = req.params;

    const {

      action,

      managerComments

    } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    const validActions = [

      'Approve',

      'Reject'

    ];

    if (

      !validActions.includes(action)

    ) {

      return res.status(400).json({

        success: false,

        message:
          'Invalid managerial review action.'

      });

    }

    // ==========================================
    // FETCH SHEET
    // ==========================================

    const sheet = await GoalSheet.findById(id)

      .populate('employee');

    if (!sheet) {

      return res.status(404).json({

        success: false,

        message:
          'GoalSheet operational record not located.'

      });

    }

    // ==========================================
    // SECURITY VALIDATION
    // ==========================================

    if (

      sheet.employee.manager?.toString()

      !== req.user._id.toString()

    ) {

      return res.status(403).json({

        success: false,

        message:
          'Access denied. Not assigned manager.'

      });

    }

    // ==========================================
    // SHEET STATUS VALIDATION
    // ==========================================

    if (

      sheet.status !== 'Submitted'

    ) {

      return res.status(400).json({

        success: false,

        message:
          'Only submitted sheets can be reviewed.'

      });

    }

    // ==========================================
    // REVIEW ACTION
    // ==========================================

    if (action === 'Approve') {

      sheet.status = 'Approved';

      sheet.isLocked = true;

    }

    if (action === 'Reject') {

      sheet.status = 'Rejected';

      sheet.isLocked = false;

    }

    sheet.managerComments =
      managerComments || '';

    await sheet.save();

    // ==========================================
    // NOTIFICATION
    // ==========================================

    await Notification.create({

      recipient: sheet.employee._id,

      title:
        `GoalSheet ${sheet.status}`,

      message:

        action === 'Approve'

          ? 'Your strategic framework has been approved by management.'

          : 'Your strategic framework requires revision.'

    });

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({

      success: true,

      message:
        `GoalSheet ${sheet.status.toLowerCase()} successfully.`,

      sheet

    });

  } catch (error) {

    next(error);

  }

};

// ==========================================
// ASSIGN SHARED GOAL
// ==========================================

exports.assignSharedGoal = async (

  req,
  res,
  next

) => {

  try {

    const {

      teamId,

      title,

      description,

      defaultWeightage,

      target

    } = req.body;

    // ==========================================
    // FETCH TEAM MEMBERS
    // ==========================================

    const dependents = await User.find({

      team: teamId

    });

    let assignedCount = 0;

    // ==========================================
    // LOOP MEMBERS
    // ==========================================

    for (const member of dependents) {

      // ==========================================
      // FIND ACTIVE SHEET
      // ==========================================

      const sheet = await GoalSheet.findOne({

        employee: member._id,

        status: {

          $ne: 'Approved'

        }

      });

      if (!sheet) continue;

      if (sheet.isLocked) continue;

      // ==========================================
      // WEIGHTAGE VALIDATION
      // ==========================================

      if (

        sheet.totalWeightage +

        Number(defaultWeightage)

        <= 100

      ) {

        // ==========================================
        // CREATE GOAL
        // ==========================================

        await Goal.create({

          goalSheet: sheet._id,

          title,

          description,

          weightage:
            Number(defaultWeightage),

          target,

          isShared: true,

          sharedFrom: req.user._id

        });

        // ==========================================
        // UPDATE SHEET
        // ==========================================

        sheet.totalWeightage +=

          Number(defaultWeightage);

        await sheet.save();

        assignedCount++;

        // ==========================================
        // NOTIFICATION
        // ==========================================

        await Notification.create({

          recipient: member._id,

          title:
            'Shared Strategic Goal Assigned',

          message:
            'A new organizational strategic vector has been assigned to your framework.'

        });

      }

    }

    // ==========================================
    // RESPONSE
    // ==========================================

    res.status(200).json({

      success: true,

      message:

        `${assignedCount} employees received shared strategic vectors.`

    });

  } catch (error) {

    next(error);

  }

};