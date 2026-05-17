const mongoose = require('mongoose');

/**
 * STRATEGIC GOAL MODEL
 * --------------------
 * Designed for GoalSync: Manages individual targets within a GoalSheet
 * with weightage-based tracking and quarterly telemetry.
 */
const goalSchema = new mongoose.Schema({
  // HIERARCHY & OWNERSHIP
  goalSheet: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'GoalSheet', 
    required: [true, 'A goal must be linked to a specific GoalSheet container.'] 
  },
  
  // CORE CONTENT
  title: { 
    type: String, 
    required: [true, 'Goal title is mandatory.'], 
    trim: true, 
    maxlength: [100, 'Title cannot exceed 100 characters.'] 
  },
  description: { 
    type: String, 
    required: [true, 'Detailed context is required for performance tracking.'] 
  },
  target: { 
    type: String, 
    required: [true, 'Define the measurable target for this goal (e.g., 20% growth).'] 
  },

  // STRATEGIC METRICS
  weightage: { 
    type: Number, 
    required: [true, 'Strategic weightage (10-100) is required.'], 
    min: [10, 'Minimum weightage for any goal is 10%.'], 
    max: [100, 'Weightage cannot exceed 100%.'] 
  },

  // COLLABORATION & SHARING
  isShared: { 
    type: Boolean, 
    default: false 
  },
  sharedFrom: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null 
  },

  // QUARTERLY TELEMETRY (Q1 - Q4)
  // Tracks status and achievement percentage for each quarter
  q1: {
    status: { type: String, enum: ['Not Started', 'On Track', 'Delayed', 'Completed'], default: 'Not Started' },
    achievement: { type: Number, default: 0, min: 0, max: 100 }
  },
  q2: {
    status: { type: String, enum: ['Not Started', 'On Track', 'Delayed', 'Completed'], default: 'Not Started' },
    achievement: { type: Number, default: 0, min: 0, max: 100 }
  },
  q3: {
    status: { type: String, enum: ['Not Started', 'On Track', 'Delayed', 'Completed'], default: 'Not Started' },
    achievement: { type: Number, default: 0, min: 0, max: 100 }
  },
  q4: {
    status: { type: String, enum: ['Not Started', 'On Track', 'Delayed', 'Completed'], default: 'Not Started' },
    achievement: { type: Number, default: 0, min: 0, max: 100 }
  },

  // AGGREGATED PROGRESS
  overallProgress: { 
    type: Number, 
    default: 0, 
    min: 0, 
    max: 100 
  }
}, { 
  timestamps: true,
  // This allows virtual properties to show up in API responses
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// ==========================================
// PERFORMANCE OPTIMIZATION (INDEXING)
// ==========================================
// Queries will be lightning fast when searching goals by sheet or shared status
goalSchema.index({ goalSheet: 1, isShared: 1 });

// ==========================================
// DYNAMIC VIRTUALS
// ==========================================
// Automatically calculates if the goal is "High Impact" based on weightage
goalSchema.virtual('isHighImpact').get(function() {
  return this.weightage >= 50;
});

module.exports = mongoose.model('Goal', goalSchema);