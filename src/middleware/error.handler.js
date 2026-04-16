const errorHandler = (err, req, res, next) => {
  res.status(err.status || 500).json({
    status: err.dataStatus || "Failed",
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
