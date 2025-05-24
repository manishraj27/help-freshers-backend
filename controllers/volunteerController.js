const Volunteer = require('../models/volunteer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { sendRegistrationEmail, sendPasswordSetupEmail } = require('../utils/emailService');

// Register volunteer
exports.registerVolunteer = async (req, res) => {
  try {
    const volunteer = new Volunteer(req.body);
    await volunteer.save();
    
    // Send registration confirmation email
    await sendRegistrationEmail(volunteer.email);

    res.status(201).json({
      success: true,
      message: 'Volunteer registered successfully. Please check your email for confirmation.'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to register volunteer',
      error: error.message
    });
  }
};

// Set password
exports.setPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const volunteer = await Volunteer.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() }
    });

    if (!volunteer) {
      return res.status(400).json({
        success: false,
        message: 'Token is invalid or has expired'
      });
    }

    volunteer.password = password;
    volunteer.passwordResetToken = undefined;
    volunteer.passwordResetExpires = undefined;
    volunteer.isPasswordSet = true;
    await volunteer.save();

    res.status(200).json({
      success: true,
      message: 'Password set successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to set password',
      error: error.message
    });
  }
};

// Volunteer login
exports.loginVolunteer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const volunteer = await Volunteer.findOne({ email }).select('+password');

    if (!volunteer || !volunteer.isPasswordSet) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or password not set'
      });
    }

    const isMatch = await volunteer.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { volunteerId: volunteer._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({
      success: true,
      token
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
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

// Add this to the existing controller
exports.getApprovedVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find({ 
      status: 'approved',
      isPasswordSet: true
    }).select('firstName lastName profession organization areasOfExpertise');

    res.json({
      success: true,
      data: volunteers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching volunteers',
      error: error.message
    });
  }
};