const Volunteer = require('../models/volunteer');

// Register a new volunteer
exports.registerVolunteer = async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    res.status(201).json({
      success: true,
      message: 'Volunteer registered successfully',
      data: volunteer
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to register volunteer',
      error: error.message
    });
  }
};

// Get all volunteers
exports.getAllVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find();
    res.status(200).json({
      success: true,
      message: 'Volunteers retrieved successfully',
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve volunteers',
      error: error.message
    });
  }
};