/**
 * Global error handler middleware
 * Handles all errors thrown in the application and returns appropriate responses
 */
const errorHandler = (err, req, res, next) => {
  // Get logger from app locals
  const logger = req.app.locals.logger;
  
  // Log the error
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    requestId: req.id,
  });

  // Default error status and message
  let statusCode = 500;
  let message = 'Internal Server Error';
  let details = undefined;

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Joi validation error
    statusCode = 400;
    message = 'Validation Error';
    details = err.details;
  } else if (err.name === 'UnauthorizedError') {
    // JWT authentication error
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'ForbiddenError') {
    // Authorization error
    statusCode = 403;
    message = 'Forbidden';
  } else if (err.name === 'NotFoundError') {
    // Resource not found
    statusCode = 404;
    message = 'Not Found';
  } else if (err.statusCode) {
    // Error with status code
    statusCode = err.statusCode;
    message = err.message;
  }

  // Send error response
  res.status(statusCode).json({
    error: {
      message,
      details,
      // Include stack trace in development mode
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

module.exports = errorHandler;
