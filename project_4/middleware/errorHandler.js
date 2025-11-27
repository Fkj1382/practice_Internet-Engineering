const errorHandler = (err, req, res, next) => {
  console.error(`Error: ${err.message}`);

  const status = err.status || 500;
  
  res.status(status).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: status,
      details: err.details || null
    },
    timestamp: new Date().toISOString()
  });
};

module.exports = errorHandler;