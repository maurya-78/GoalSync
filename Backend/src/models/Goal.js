const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
    },
    description: { type: String, default: '' },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    cycle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cycle' },
    goalSheet: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalSheet' },
    category: {
      type: String,
      enum: ['individual', 'team', 'department', 'organization'],
      default: 'individual',
    },
    status: {
      type: String,
      enum: ['draft', 'pending_approval', 'approved', 'in_progress', 'completed', 'rejected'],
      default: 'draft',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
    },
    weightage: { type: Number, default: 1, min: 0, max: 100 },
    kpiTarget: { type: Number, default: 100 },
    kpiUnit: { type: String, default: '%' },
    // Quarterly tracking
    q1Progress: { type: Number, default: 0, min: 0, max: 100 },
    q2Progress: { type: Number, default: 0, min: 0, max: 100 },
    q3Progress: { type: Number, default: 0, min: 0, max: 100 },
    q4Progress: { type: Number, default: 0, min: 0, max: 100 },
    overallProgress: { type: Number, default: 0, min: 0, max: 100 },
    startDate: { type: Date },
    dueDate: { type: Date },
    completedDate: { type: Date },
    managerFeedback: { type: String, default: '' },
    isLocked: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

// Auto-calculate overall progress
GoalSchema.pre('save', function (next) {
  const avg = (this.q1Progress + this.q2Progress + this.q3Progress + this.q4Progress) / 4;
  this.overallProgress = Math.round(avg);
  next();
});

module.exports = mongoose.model('Goal', GoalSchema);