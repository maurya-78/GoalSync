/**
 * ==========================================
 * GOALSYNC ENTERPRISE VALIDATION MIDDLEWARE
 * ==========================================
 * Validates:
 * - Goal creation
 * - Goal updates
 * - Quarterly telemetry
 * - Strategic integrity rules
 */

// ==========================================
// VALID STATUSES
// ==========================================

const VALID_STATUSES = [

  'Not Started',

  'On Track',

  'Delayed',

  'Completed'

];

// ==========================================
// CREATE GOAL VALIDATION
// ==========================================

exports.validateGoal = (
  req,
  res,
  next
) => {

  try {

    const {

      title,

      description,

      target,

      weightage

    } = req.body;

    // ==========================================
    // TITLE
    // ==========================================

    if (

      !title ||

      title.trim().length < 5

    ) {

      return res.status(400).json({

        success: false,

        message:
          'Goal title must contain at least 5 characters.'

      });

    }

    // ==========================================
    // DESCRIPTION
    // ==========================================

    if (

      !description ||

      description.trim().length < 10

    ) {

      return res.status(400).json({

        success: false,

        message:
          'Strategic description must contain at least 10 characters.'

      });

    }

    // ==========================================
    // TARGET
    // ==========================================

    if (

      !target ||

      target.trim().length < 2

    ) {

      return res.status(400).json({

        success: false,

        message:
          'Strategic target definition is required.'

      });

    }

    // ==========================================
    // WEIGHTAGE
    // ==========================================

    if (

      typeof weightage !== 'number' ||

      weightage < 10 ||

      weightage > 100

    ) {

      return res.status(400).json({

        success: false,

        message:
          'Goal weightage must be between 10% and 100%.'

      });

    }

    next();

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        'Validation execution failure.'

    });

  }

};

// ==========================================
// QUARTERLY UPDATE VALIDATION
// ==========================================

exports.validateQuarterUpdate = (
  req,
  res,
  next
) => {

  try {

    const quarters = [

      'q1',

      'q2',

      'q3',

      'q4'

    ];

    for (const quarter of quarters) {

      if (req.body[quarter]) {

        const {

          achievement,

          status

        } = req.body[quarter];

        // ==========================================
        // ACHIEVEMENT
        // ==========================================

        if (

          achievement !== undefined && (

            achievement < 0 ||

            achievement > 100

          )

        ) {

          return res.status(400).json({

            success: false,

            message:
              `${quarter.toUpperCase()} achievement must be between 0 and 100.`

          });

        }

        // ==========================================
        // STATUS
        // ==========================================

        if (

          status &&

          !VALID_STATUSES.includes(status)

        ) {

          return res.status(400).json({

            success: false,

            message:
              `${quarter.toUpperCase()} status is invalid.`

          });

        }

      }

    }

    next();

  } catch (error) {

    return res.status(500).json({

      success: false,

      message:
        'Quarter validation engine failed.'

    });

  }

};