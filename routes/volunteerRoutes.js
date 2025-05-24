const express = require('express');
const router = express.Router();
const { 
  registerVolunteer, 
  setPassword, 
  loginVolunteer, 
  getAllVolunteers, 
  getApprovedVolunteers 
} = require('../controllers/volunteerController');

router.post('/register', registerVolunteer);
router.post('/set-password', setPassword);
router.post('/login', loginVolunteer);
router.get('/', getAllVolunteers);
// Add this route to the existing routes
router.get('/approved', getApprovedVolunteers);

module.exports = router;