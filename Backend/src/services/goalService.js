const Goal = require('../models/Goal');
const GoalSheet = require('../models/GoalSheet');

class GoalService {
  async getEmployeeGoals(userId, cycleId) {
    const sheet = await GoalSheet.findOne({ employee: userId, cycle: cycleId });
    if (!sheet) return { sheet: null, goals: [] };
    
    const goals = await Goal.find({ goalSheet: sheet._id }).sort({ createdAt: -1 });
    return { sheet, goals };
  }

  async createGoal(userId, goalData) {
    const { goalSheetId, weightage } = goalData;
    
    const sheet = await GoalSheet.findById(goalSheetId);
    if (!sheet || sheet.employee.toString() !== userId) {
      throw new Error('Goal Sheet access denied or not found');
    }

    const currentGoals = await Goal.find({ goalSheet: goalSheetId });
    const totalWeight = currentGoals.reduce((sum, g) => sum + g.weightage, 0);

    if (totalWeight + Number(weightage) > 100) {
      throw new Error(`Weightage overflow. Remaining capacity: ${100 - totalWeight}%`);
    }

    const goal = await Goal.create({ ...goalData, user: userId });
    
    // Update total weightage in sheet
    sheet.totalWeightage = totalWeight + Number(weightage);
    await sheet.save();

    return goal;
  }

  async updateGoalProgress(goalId, userId, updates) {
    const goal = await Goal.findOne({ _id: goalId, user: userId });
    if (!goal) throw new Error('Goal not found or unauthorized');

    // Update specific quarter data
    if (updates.q1) goal.q1 = { ...goal.q1, ...updates.q1 };
    if (updates.q2) goal.q2 = { ...goal.q2, ...updates.q2 };
    if (updates.q3) goal.q3 = { ...goal.q3, ...updates.q3 };
    if (updates.q4) goal.q4 = { ...goal.q4, ...updates.q4 };

    // Recalculate overall progress: (Q1+Q2+Q3+Q4) / 4
    const totalAch = (goal.q1.achievement + goal.q2.achievement + goal.q3.achievement + goal.q4.achievement);
    goal.overallProgress = Math.round(totalAch / 4);

    return await goal.save();
  }
}

module.exports = new GoalService();