const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const createMailOptions = (email, subject, html) => ({
  from: "HelpFreshers <noreply@helpfreshers.in>",
  to: email,
  subject,
  html,
});

exports.sendRegistrationEmail = async (email) => {
  const mailOptions = createMailOptions(
    email,
    'Registration Received - HelpFreshers',
    `
      <h1>Thank you for registering with HelpFreshers!</h1>
      <p>Your volunteer registration has been received and is under review.</p>
      <p>Once approved, you will receive another email to set up your account password.</p>
      <p>Thank you for your interest in helping freshers!</p>
    `
  );

  await transporter.sendMail(mailOptions);
};

exports.sendPasswordSetupEmail = async (email, token) => {
  const resetUrl = `${process.env.FRONTEND_URL}/volunteer/set-password?token=${token}`;
  
  const mailOptions = createMailOptions(
    email,
    'Set Your Password - HelpFreshers',
    `
      <h1>Your Registration is Approved!</h1>
      <p>Congratulations! Your volunteer registration has been approved.</p>
      <p>Please click the link below to set your password and access your account:</p>
      <a href="${resetUrl}">Set Password</a>
      <p>This link will expire in 24 hours.</p>
    `
  );

  await transporter.sendMail(mailOptions);
};

exports.sendStatusUpdateEmail = async (email, status) => {
  const mailOptions = createMailOptions(
    email,
    'Volunteer Status Update - HelpFreshers',
    `
      <h1>Status Update</h1>
      <p>Your volunteer status has been updated to: ${status}</p>
      ${status === 'approved' ? 
        '<p>You will receive a separate email shortly to set up your account password.</p>' : 
        '<p>Login to your account to check more details.</p>'}
    `
  );

  await transporter.sendMail(mailOptions);
};

exports.sendSessionRequestEmail = async (email, session) => {
  const mailOptions = createMailOptions(
    email,
    'New Session Request',
    `
    <h2>New Session Request</h2>
    <p>You have a new session request from ${session.user.name}</p>
    <p>Details:</p>
    <ul>
      <li>Date: ${new Date(session.scheduledFor).toLocaleString()}</li>
      <li>Topic: ${session.topic}</li>
      <li>Duration: ${session.duration} minutes</li>
    </ul>
    <p>Please log in to accept or reject this request.</p>
    `
  );

  await transporter.sendMail(mailOptions);
};

exports.sendSessionConfirmationEmail = async (email, session) => {
  const mailOptions = createMailOptions(
    email,
    'Session Confirmed',
    `
    <h2>Session Confirmed</h2>
    <p>Your session has been confirmed!</p>
    <p>Details:</p>
    <ul>
      <li>Date: ${new Date(session.scheduledFor).toLocaleString()}</li>
      <li>Topic: ${session.topic}</li>
      <li>Duration: ${session.duration} minutes</li>
      <li>Meet Link: <a href="${session.meetLink}">${session.meetLink}</a></li>
    </ul>
    `
  );

  await transporter.sendMail(mailOptions);
};