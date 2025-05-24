const express = require('express');
const router = express.Router();
const { 
  registerAdmin, 
  loginAdmin, 
  updateVolunteerStatus, 
  deleteVolunteer 
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');

// Admin auth routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

// Volunteer management routes (protected)
router.put('/volunteers/:volunteerId/status', authMiddleware, updateVolunteerStatus);
router.delete('/volunteers/:volunteerId', authMiddleware, deleteVolunteer);

module.exports = router;