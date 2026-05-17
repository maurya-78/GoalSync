const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // e.g., "GOAL_UPDATE", "SHEET_APPROVE"
  entityType: { type: String, required: true }, // e.g., "GoalSheet", "Goal"
  entityId: { type: mongoose.Schema.Types.ObjectId, required: true },
  previousValue: { type: mongoose.Schema.Types.Mixed },
  newValue: { type: mongoose.Schema.Types.Mixed }
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);