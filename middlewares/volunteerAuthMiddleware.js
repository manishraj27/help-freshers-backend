const jwt = require('jsonwebtoken');
const Volunteer = require('../models/volunteer');

const volunteerAuthMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No authentication token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const volunteer = await Volunteer.findById(decoded.volunteerId);

    if (!volunteer) {
      return res.status(401).json({
        success: false,
        message: 'Authentication failed'
      });
    }

    req.volunteer = volunteer;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message
    });
  }
};

module.exports = volunteerAuthMiddleware;