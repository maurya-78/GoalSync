const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  goalSheet: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalSheet', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  weightage: { type: Number, required: true, min: 10, max: 100 },
  target: { type: String, required: true },
  isShared: { type: Boolean, default: false },
  sharedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  q1Status: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' },
  q2Status: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' },
  q3Status: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' },
  q4Status: { type: String, enum: ['Not Started', 'On Track', 'Completed'], default: 'Not Started' },
  q1Achievement: { type: Number, default: 0 }, // percentage 0-100
  q2Achievement: { type: Number, default: 0 },
  q3Achievement: { type: Number, default: 0 },
  q4Achievement: { type: Number, default: 0 },
  overallProgress: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Goal', goalSchema);