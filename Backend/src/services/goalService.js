const Goal = require('../models/Goal');

/**
 * Business Logic: Calculate overall progress for a goal sheet
 */
exports.calculateOverallProgress = (goals) => {
    if (!goals || goals.length === 0) return 0;
    
    const totalProgress = goals.reduce((acc, goal) => {
        // Simple average of 4 quarters
        const avg = (goal.q1Achievement + goal.q2Achievement + goal.q3Achievement + goal.q4Achievement) / 4;
        return acc + (avg * (goal.weightage / 100));
    }, 0);

    return Math.round(totalProgress);
};