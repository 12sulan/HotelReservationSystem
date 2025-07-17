export const errorHandler = (err, req, res, next) => {
  console.error("❗ Error:", err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong",
    stack: err.stack,
  });
};
