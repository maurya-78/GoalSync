const mongoose = require('mongoose');

const goalSheetSchema = new mongoose.Schema({
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cycle: { type: mongoose.Schema.Types.ObjectId, ref: 'GoalCycle', required: true },
  status: { 
    type: String, 
    enum: ['Draft', 'Pending Approval', 'Approved', 'Rejected'], 
    default: 'Draft' 
  },
  isLocked: { type: Boolean, default: false },
  managerComments: { type: String, default: '' },
  totalWeightage: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('GoalSheet', goalSheetSchema);