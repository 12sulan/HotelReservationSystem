export const errorHandler = (err, req, res, next) => {
  // Respect custom status if set by createError or controllers
  const status = err.status || err.statusCode || 500;
  console.error("❗ Error:", err.stack || err.message || err);

  res.status(status).json({
    success: false,
    message: err.message || "Something went wrong",
    // Only include stack in non-production for debugging
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
};
