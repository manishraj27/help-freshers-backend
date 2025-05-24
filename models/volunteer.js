const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
  },
  password: {
    type: String,
    select: false
  },
  passwordResetToken: {
    type: String,
    select: false
  },
  passwordResetExpires: {
    type: Date,
    select: false
  },
  isPasswordSet: {
    type: Boolean,
    default: false
  }
});

// Hash password before saving
volunteerSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
volunteerSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Update the updatedAt timestamp before saving
volunteerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Volunteer = mongoose.model('Volunteer', volunteerSchema);

module.exports = Volunteer;