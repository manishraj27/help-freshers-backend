const express = require('express');
const router = express.Router();
const { 
  bookSession, 
  updateSessionStatus, 
  getVolunteerSessions 
} = require('../controllers/sessionController');
const volunteerAuthMiddleware = require('../middlewares/volunteerAuthMiddleware');

// Public route for booking sessions
router.post('/book', bookSession);

// Protected routes for volunteers
router.put('/:sessionId/status', volunteerAuthMiddleware, updateSessionStatus);
router.get('/volunteer/:volunteerId', volunteerAuthMiddleware, getVolunteerSessions);

module.exports = router;