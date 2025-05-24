const Session = require('../models/session');
const Volunteer = require('../models/volunteer');
const { sendSessionRequestEmail, sendSessionConfirmationEmail } = require('../utils/emailService');

// Book a session
exports.bookSession = async (req, res) => {
  try {
    const { volunteerId, userData, scheduledFor, topic } = req.body;
    
    const volunteer = await Volunteer.findById(volunteerId);
    if (!volunteer) {
      return res.status(404).json({
        success: false,
        message: 'Volunteer not found'
      });
    }

    const session = new Session({
      volunteer: volunteerId,
      user: userData,
      scheduledFor: new Date(scheduledFor),
      topic
    });

    await session.save();

    // Send email to volunteer
    await sendSessionRequestEmail(volunteer.email, session);

    res.status(201).json({
      success: true,
      message: 'Session request sent successfully',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error booking session',
      error: error.message
    });
  }
};

// Accept/Reject session
exports.updateSessionStatus = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { status, meetLink } = req.body;

    const session = await Session.findById(sessionId).populate('volunteer');
    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    session.status = status;
    if (status === 'accepted') {
      session.meetLink = meetLink;
      // Send confirmation emails to both parties
      await sendSessionConfirmationEmail(session.user.email, session);
      await sendSessionConfirmationEmail(session.volunteer.email, session);
    }

    await session.save();

    res.json({
      success: true,
      message: 'Session status updated successfully',
      data: session
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating session status',
      error: error.message
    });
  }
};

// Get volunteer's sessions
exports.getVolunteerSessions = async (req, res) => {
  try {
    const { volunteerId } = req.params;
    const sessions = await Session.find({ volunteer: volunteerId })
      .sort({ scheduledFor: 'asc' });

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions',
      error: error.message
    });
  }
};