const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  // Personal Information
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  // Professional Information
  profession: {
    type: String,
    required: true,
    trim: true
  },
  organization: {
    type: String,
    trim: true
  },
  yearsOfExperience: {
    type: Number,
    required: true,
    min: 0
  },
  linkedinProfile: {
    type: String,
    trim: true
  },
  // Volunteering Preferences
  rolePreference: {
    type: String,
    required: true,
    enum: ['Mentor', 'Content Creator', 'Tech Volunteer']
  },
  availabilityHoursPerWeek: {
    type: Number,
    required: true,
    min: 1
  },
  preferredSchedule: [{
    type: String,
    enum: ['Weekday Mornings', 'Weekday Evenings', 'Weekends']
  }],
  areasOfExpertise: [{
    type: String,
    required: true
  }],
  // Additional Information
  motivation: {
    type: String,
    required: true
  },
  skills: [{
    type: String
  }],
  // Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
volunteerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;