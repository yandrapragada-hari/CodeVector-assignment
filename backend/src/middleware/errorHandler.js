/**
 * Global Error Handler Middleware
 * Catches all errors thrown in route handlers and formats a consistent response
 */

/**
 * Central error handling middleware
 * Must be registered LAST in Express middleware chain (4 params = error handler)
 *
 * @param {Error} err     - Error object thrown in route handler
 * @param {object} req    - Express request
 * @param {object} res    - Express response
 * @param {function} next - Next middleware (required signature, even if unused)
 */
const errorHandler = (err, req, res, next) => {
  // Log the full error in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("❌ Error:", err.stack);
  } else {
    console.error("❌ Error:", err.message);
  }

  // ── Mongoose Validation Error ───────────────────────────────────────────────
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }

  // ── Mongoose CastError (invalid ObjectId) ───────────────────────────────────
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  // ── Mongoose Duplicate Key Error ────────────────────────────────────────────
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `Duplicate value for field: ${field}`,
    });
  }

  // ── Default: Internal Server Error ─────────────────────────────────────────
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    // Only expose stack trace in development
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

/**
 * 404 Not Found Handler
 * Catches requests to undefined routes
 */
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

module.exports = { errorHandler, notFound };
