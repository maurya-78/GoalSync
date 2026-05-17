const GoalSheet = require('../models/GoalSheet');
const Goal = require('../models/Goal');
const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getTeamDashboard = async (req, res, next) => {
  try {
    const teamMembers = await User.find({ manager: req.user._id }).populate('department team');
    const memberIds = teamMembers.map(m => m._id);
    const sheets = await GoalSheet.find({ employee: { $in: memberIds } }).populate('employee');
    res.json({ teamMembers, sheets });
  } catch (error) { next(error); }
};

exports.reviewGoalSheet = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { action, managerComments } = req.body; // action: 'Approve' or 'Reject'
    const sheet = await GoalSheet.findById(id);
    if (!sheet) { res.status(404); throw new Error('Goal sheet configuration record unlocated.'); }

    if (action === 'Approve') {
      sheet.status = 'Approved';
      sheet.isLocked = true;
    } else if (action === 'Reject') {
      sheet.status = 'Rejected';
      sheet.isLocked = false;
    }
    sheet.managerComments = managerComments || '';
    await sheet.save();

    await Notification.create({
      recipient: sheet.employee,
      title: `Strategic Framework Reference ${sheet.status}`,
      message: `Your corporate framework targets matrix was processed: status evaluation set to ${sheet.status}.`
    });

    res.json(sheet);
  } catch (error) { next(error); }
};

exports.assignSharedGoal = async (req, res, next) => {
  try {
    const { teamId, title, description, defaultWeightage, target } = req.body;
    const dependents = await User.find({ team: teamId });
    
    for (const member of dependents) {
      let sheet = await GoalSheet.findOne({ employee: member._id });
      if (!sheet) continue;
      if (sheet.isLocked) continue; // Skip historically finalized operational sets
      
      if (sheet.totalWeightage + Number(defaultWeightage) <= 100) {
        await Goal.create({
          goalSheet: sheet._id, title, description, weightage: defaultWeightage, target, isShared: true, sharedFrom: req.user._id
        });
        sheet.totalWeightage += Number(defaultWeightage);
        await sheet.save();
      }
    }
    res.json({ message: 'Strategic target shared layout injected successfully down structural dependency chains.' });
  } catch (error) { next(error); }
};