const Admin = require('../models/admin');
const Volunteer = require('../models/volunteer');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendStatusUpdateEmail, sendPasswordSetupEmail } = require('../utils/emailService');

// Admin registration
exports.registerAdmin = async (req, res) => {
  try {
    const admin = new Admin(req.body);
    await admin.save();
    res.status(201).json({
      success: true,
      message: 'Admin registered successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Failed to register admin',
      error: error.message
    });
  }
};

// Admin login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email });
    
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const token = jwt.sign(
      { adminId: admin._id },
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

// Update volunteer status
exports.updateVolunteerStatus = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const { status } = req.body;

    const volunteer = await Volunteer.findById(volunteerId);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    // If status is being updated to 'approved' and password isn't set yet
    if (status === 'approved' && !volunteer.isPasswordSet) {
      // Generate password reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      volunteer.passwordResetToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
      volunteer.passwordResetExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
      
      // Update status
      volunteer.status = status;
      await volunteer.save();

      // Send both status update and password setup emails
      await sendStatusUpdateEmail(volunteer.email, status);
      await sendPasswordSetupEmail(volunteer.email, resetToken);
    } else {
      // Just update status for other cases
      volunteer.status = status;
      await volunteer.save();
      await sendStatusUpdateEmail(volunteer.email, status);
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer status updated successfully',
      data: volunteer
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update volunteer status',
      error: error.message
    });
  }
};

// Delete volunteer
exports.deleteVolunteer = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const volunteer = await Volunteer.findByIdAndDelete(volunteerId);

    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Volunteer deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete volunteer',
      error: error.message
    });
  }
};