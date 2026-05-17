const mongoose = require('mongoose');

const goalCycleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // e.g., "FY 2026 Performance Cycle"
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('GoalCycle', goalCycleSchema);