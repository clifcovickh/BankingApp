const adminOnly = (req, res, next) => {
  const role = req.headers['x-api-role'];

  if (role === 'admin') {
    next(); // Move to the controller
  } else {
    res.status(403).json({
      message: 'Access Denied: This action requires Administrator privileges.',
    });
  }
};

module.exports = { adminOnly };
