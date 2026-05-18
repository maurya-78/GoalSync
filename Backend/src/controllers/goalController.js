const Goal = require('../models/Goal');
const { Notification } = require('../models/index');

// @desc    Create goal
// @route   POST /api/goals
// @access  Private
exports.createGoal = async (req, res, next) => {
  try {
    req.body.owner = req.user.id;
    const goal = await Goal.create(req.body);
    const populated = await goal.populate('owner', 'name email avatar');
    res.status(201).json({ success: true, goal: populated });
  } catch (err) {
    next(err);
  }
};

// @desc    Get goals (filtered by role)
// @route   GET /api/goals
// @access  Private
exports.getGoals = async (req, res, next) => {
  try {
    let query = {};
    const { status, priority, cycle, q } = req.query;

    if (req.user.role === 'employee') {
      query.owner = req.user.id;
    } else if (req.user.role === 'manager') {
      // Manager sees their team's goals
      const User = require('../models/User');
      const teamMembers = await User.find({ manager: req.user.id }).select('_id');
      const memberIds = teamMembers.map((m) => m._id);
      memberIds.push(req.user.id);
      query.owner = { $in: memberIds };
    }
    // Admin sees all

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (cycle) query.cycle = cycle;
    if (q) query.title = { $regex: q, $options: 'i' };

    const goals = await Goal.find(query)
      .populate('owner', 'name email avatar role')
      .populate('cycle', 'name year')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: goals.length, goals });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single goal
// @route   GET /api/goals/:id
// @access  Private
exports.getGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id)
      .populate('owner', 'name email avatar role designation')
      .populate('cycle', 'name year');

    if (!goal) {
      return res.status(404).json({ success: false, message: 'Goal not found' });
    }

    // Auth check
    if (req.user.role === 'employee' && goal.owner._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, goal });
  } catch (err) {
    next(err);
  }
};

// @desc    Update goal
// @route   PUT /api/goals/:id
// @access  Private
exports.updateGoal = async (req, res, next) => {
  try {
    let goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

    if (goal.isLocked && req.user.role !== 'admin') {
      return res.status(400).json({ success: false, message: 'Goal is locked' });
    }
    if (req.user.role === 'employee' && goal.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    goal = await Goal.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate('owner', 'name email avatar');

    res.status(200).json({ success: true, goal });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete goal
// @route   DELETE /api/goals/:id
// @access  Private
exports.deleteGoal = async (req, res, next) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

    if (req.user.role === 'employee' && goal.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await goal.deleteOne();
    res.status(200).json({ success: true, message: 'Goal deleted' });
  } catch (err) {
    next(err);
  }
};

// @desc    Approve or reject goal (manager/admin)
// @route   PUT /api/goals/:id/review
// @access  Private (manager, admin)
exports.reviewGoal = async (req, res, next) => {
  try {
    const { status, feedback } = req.body;
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { status, managerFeedback: feedback || '' },
      { new: true }
    ).populate('owner', 'name email');

    if (!goal) return res.status(404).json({ success: false, message: 'Goal not found' });

    // Create notification
    await Notification.create({
      recipient: goal.owner._id,
      sender: req.user.id,
      type: status === 'approved' ? 'goal_approved' : 'goal_rejected',
      title: `Goal ${status === 'approved' ? 'Approved' : 'Rejected'}`,
      message: `Your goal "${goal.title}" has been ${status}.${feedback ? ` Feedback: ${feedback}` : ''}`,
    });

    res.status(200).json({ success: true, goal });
  } catch (err) {
    next(err);
  }
};

// @desc    Get goal analytics
// @route   GET /api/goals/analytics
// @access  Private
exports.getAnalytics = async (req, res, next) => {
  try {
    let matchQuery = {};
    if (req.user.role === 'employee') matchQuery.owner = req.user.id;

    const [statusStats, priorityStats, progressStats] = await Promise.all([
      Goal.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),
      Goal.aggregate([
        { $match: matchQuery },
        { $group: { _id: '$priority', count: { $sum: 1 } } },
      ]),
      Goal.aggregate([
        { $match: matchQuery },
        {
          $group: {
            _id: null,
            avgProgress: { $avg: '$overallProgress' },
            totalGoals: { $sum: 1 },
            completedGoals: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
          },
        },
      ]),
    ]);

    res.status(200).json({
      success: true,
      analytics: { statusStats, priorityStats, progressStats: progressStats[0] || {} },
    });
  } catch (err) {
    next(err);
  }
};