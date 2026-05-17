/**
 * ==========================================
 * GLOBAL ENTERPRISE ERROR HANDLER
 * ==========================================
 * Handles:
 * - Validation errors
 * - MongoDB errors
 * - JWT errors
 * - Production-safe responses
 */

// ==========================================
// MAIN ERROR HANDLER
// ==========================================

const errorHandler = (

  err,
  req,
  res,
  next

) => {

  // ==========================================
  // DEFAULTS
  // ==========================================

  let statusCode =

    res.statusCode === 200

      ? 500

      : res.statusCode;

  let message = err.message;

  // ==========================================
  // DEVELOPMENT LOGGING
  // ==========================================

  if (

    process.env.NODE_ENV !== 'production'

  ) {

    console.error('\n❌ ERROR STACK:\n');

    console.error(err);

  }

  // ==========================================
  // MONGOOSE: INVALID OBJECT ID
  // ==========================================

  if (err.name === 'CastError') {

    statusCode = 404;

    message =
      'Requested operational record not found.';

  }

  // ==========================================
  // MONGOOSE: DUPLICATE KEY
  // ==========================================

  if (err.code === 11000) {

    statusCode = 400;

    const field =

      Object.keys(err.keyValue)[0];

    message =
      `${field} already exists in the system.`;

  }

  // ==========================================
  // MONGOOSE: VALIDATION ERROR
  // ==========================================

  if (

    err.name === 'ValidationError'

  ) {

    statusCode = 400;

    message = Object.values(

      err.errors

    )

      .map(val => val.message)

      .join(', ');

  }

  // ==========================================
  // JWT: INVALID TOKEN
  // ==========================================

  if (

    err.name === 'JsonWebTokenError'

  ) {

    statusCode = 401;

    message =
      'Authentication token integrity failed.';

  }

  // ==========================================
  // JWT: EXPIRED TOKEN
  // ==========================================

  if (

    err.name === 'TokenExpiredError'

  ) {

    statusCode = 401;

    message =
      'Authentication session expired.';

  }

  // ==========================================
  // RESPONSE
  // ==========================================

  res.status(statusCode).json({

    success: false,

    statusCode,

    message,

    stack:

      process.env.NODE_ENV === 'production'

        ? null

        : err.stack,

  });

};

// ==========================================
// 404 NOT FOUND HANDLER
// ==========================================

const notFound = (

  req,
  res,
  next

) => {

  const error = new Error(

    `Route not found: ${req.originalUrl}`

  );

  res.status(404);

  next(error);

};

// ==========================================
// EXPORTS
// ==========================================

module.exports = {

  errorHandler,

  notFound

};