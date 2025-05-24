const express = require('express');
const router = express.Router();
const { 
  registerVolunteer, 
  setPassword, 
  loginVolunteer, 
  getAllVolunteers 
} = require('../controllers/volunteerController');

router.post('/register', registerVolunteer);
router.post('/set-password', setPassword);
router.post('/login', loginVolunteer);
router.get('/', getAllVolunteers);

module.exports = router;