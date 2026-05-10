function errorHandler(err, req, res, next) {
  console.error(`[ERROR] ${err.message}`);
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  res.status(status).json({
    error: status === 500 ? 'Internal server error' : err.message,
    ...(process.env.NODE_ENV === 'development' && { detail: err.stack })
  });
}
module.exports = errorHandler;