const express = require('express');
const router = express.Router();
const { registerVolunteer, getAllVolunteers } = require('../controllers/volunteerController');

// Register a new volunteer
router.post('/register', registerVolunteer);

// Get all volunteers
router.get('/', getAllVolunteers);

module.exports = router;