const Cycle = require('../models/Cycle');

/**
 * @desc    Create a new Operational Cycle
 * @route   POST /api/v1/cycles
 * @access  Private (Admin Only)
 */
exports.createCycle = async (req, res, next) => {
  try {
    const { name, startDate, endDate } = req.body;

    // 1. Check if cycle name already exists
    const existingCycle = await Cycle.findOne({ name });
    if (existingCycle) {
      return res.status(400).json({ success: false, message: "Cycle with this name already exists." });
    }

    const cycle = await Cycle.create(req.body);

    res.status(201).json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all cycles (with filtering)
 * @route   GET /api/v1/cycles
 * @access  Private
 */
exports.getCycles = async (req, res, next) => {
  try {
    const cycles = await Cycle.find().sort({ startDate: -1 });
    res.status(200).json({ success: true, count: cycles.length, data: cycles });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get the currently Active cycle for GoalSync
 * @route   GET /api/v1/cycles/active
 * @access  Private
 */
exports.getActiveCycle = async (req, res, next) => {
  try {
    const cycle = await Cycle.findOne({ status: 'Active' });
    
    if (!cycle) {
      return res.status(404).json({ success: false, message: "No active operational cycle found." });
    }

    res.status(200).json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Cycle (e.g., Change status to Archived)
 * @route   PUT /api/v1/cycles/:id
 * @access  Private (Admin Only)
 */
exports.updateCycle = async (req, res, next) => {
  try {
    let cycle = await Cycle.findById(req.params.id);

    if (!cycle) {
      return res.status(404).json({ success: false, message: "Cycle not found." });
    }

    // Business Logic: If setting to Active, deactivate other active cycles
    if (req.body.status === 'Active') {
      await Cycle.updateMany({ _id: { $ne: cycle._id } }, { status: 'Archived' });
    }

    cycle = await Cycle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({ success: true, data: cycle });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete Cycle (Only if Upcoming/Not in use)
 * @route   DELETE /api/v1/cycles/:id
 * @access  Private (Admin Only)
 */
exports.deleteCycle = async (req, res, next) => {
  try {
    const cycle = await Cycle.findById(req.params.id);

    if (!cycle) {
      return res.status(404).json({ success: false, message: "Cycle not found." });
    }

    if (cycle.status === 'Active') {
      return res.status(400).json({ success: false, message: "Cannot delete an active cycle." });
    }

    await cycle.deleteOne();

    res.status(200).json({ success: true, message: "Cycle purged successfully." });
  } catch (error) {
    next(error);
  }
};