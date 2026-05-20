const mongoose = require('mongoose');

// ─── GoalSheet 
const GoalSheetSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cycle: { type: mongoose.Schema.Types.ObjectId, ref: 'Cycle', required: true },
    goals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Goal' }],
    totalWeightage: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    lockedAt: Date,
    status: {
      type: String,
      enum: ['draft', 'submitted', 'approved', 'locked'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

// ─── Cycle
const CycleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    year: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: false },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// ─── Team 
const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, default: '' },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    department: { type: mongoose.Schema.Types.ObjectId, ref: 'Department' },
  },
  { timestamps: true }
);

// ─── Department 
const DepartmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    head: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// ─── Notification 
const NotificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      enum: ['goal_approved', 'goal_rejected', 'goal_submitted', 'feedback', 'general'],
      default: 'general',
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    link: { type: String, default: '' },
  },
  { timestamps: true }
);

const GoalSheet = mongoose.model('GoalSheet', GoalSheetSchema);
const Cycle = mongoose.model('Cycle', CycleSchema);
const Team = mongoose.model('Team', TeamSchema);
const Department = mongoose.model('Department', DepartmentSchema);
const Notification = mongoose.model('Notification', NotificationSchema);

module.exports = { GoalSheet, Cycle, Team, Department, Notification };
