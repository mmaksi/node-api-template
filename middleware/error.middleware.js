const ErrorResponse = require("../utils/errorResponse");

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log to console for development
  console.log(err.stack.red);

  // Mongoose errors
  switch (err.name) {
    case `CastError`:
      const message = `Resource not found with id: ${err.value}`;
      error = new ErrorResponse(message, 404);
      break;

    case `ValidationError`:
      const messages = Object.values(err.errors).map((val) => val.message);
      error = new ErrorResponse(messages, 404);
      break;
    default:
      break;
  }

  // Mongo errors
  switch (err.code) {
    case 11000:
      const message = `Duplicate field value entered`;
      error = new ErrorResponse(message, 400);
      break;
    default:
      break;
  }

  return res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || `Server Error`,
  });
};

module.exports = errorHandler;
