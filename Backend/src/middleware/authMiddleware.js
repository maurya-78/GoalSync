const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user || !req.user.isActive) {
        return res.status(401).json({ message: 'User unauthorized or disabled.' });
      }
      return next();
    } catch (err) {
      return res.status(401).json({ message: 'Token structural validation failed.' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'No authorization credentials received.' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: insufficient clearance hierarchy.' });
    }
    next();
  };
};

module.exports = { protect, authorize };