const mongoose = require('mongoose');

/**
 * OPERATIONAL CYCLE MODEL
 * -----------------------
 * Defines enterprise performance cycles
 * like FY, Quarterly operational periods.
 */

const cycleSchema = new mongoose.Schema({

  // CORE IDENTITY
  name: {
    type: String,
    required: [true, 'Cycle name is mandatory (e.g., FY 2026-27)'],
    unique: true,
    trim: true
  },

  description: {
    type: String,
    required: [true, 'Cycle description is required']
  },

  // BUSINESS CLASSIFICATION
  year: {
    type: Number,
    required: [true, 'Operational year is required']
  },

  quarter: {
    type: String,
    enum: ['Q1', 'Q2', 'Q3', 'Q4'],
    required: [true, 'Quarter classification is required']
  },

  // DATE RANGE
  startDate: {
    type: Date,
    required: [true, 'Cycle start date is required']
  },

  endDate: {
    type: Date,
    required: [true, 'Cycle end date is required']
  },

  // SYSTEM STATUS
  status: {
    type: String,
    enum: ['Active', 'Archived', 'Upcoming'],
    default: 'Upcoming'
  },

  // SECURITY CONTROL
  isLocked: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

// ==========================================
// PERFORMANCE INDEXES
// ==========================================

cycleSchema.index({ status: 1 });

cycleSchema.index({
  year: 1,
  quarter: 1
});

// ==========================================
// AUTO-ARCHIVE PREVIOUS ACTIVE CYCLES
// ==========================================

cycleSchema.pre('save', async function(next) {

  try {

    if (this.status === 'Active') {

      await mongoose.model('Cycle').updateMany(

        {
          _id: { $ne: this._id }
        },

        {
          status: 'Archived'
        }

      );

    }

    next();

  } catch (error) {

    next(error);

  }

});

// ==========================================
// VIRTUAL PROPERTY
// ==========================================

cycleSchema.virtual('isCurrentlyRunning').get(function() {

  const now = new Date();

  return (
    now >= this.startDate &&
    now <= this.endDate &&
    this.status === 'Active'
  );

});

module.exports = mongoose.model('Cycle', cycleSchema);