const asyncHandler = require("express-async-handler");
const nodemailer = require("nodemailer");
const User = require("../models/User");

/**
 * @desc    Send contact email to admin
 * @route   POST /api/contact
 * @access  Private
 */
const sendContactEmail = asyncHandler(async (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    res.status(400);
    throw new Error("Please provide subject and message");
  }

  // Get user details
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const adminEmail = process.env.ADMIN_EMAIL || process.env.EMAIL_USER;

  // Email options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: adminEmail,
    subject: `Rentify Contact: ${subject}`,
    html: `
      <h2>New Contact Message from Rentify</h2>
      <p><strong>From:</strong> ${user.name} (${user.email})</p>
      <p><strong>Subject:</strong> ${subject}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br>")}</p>
      <hr>
      <p><small>This message was sent from the Rentify contact form.</small></p>
    `,
  };

  // Send email
  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: "Email sent successfully" });
});

module.exports = { sendContactEmail };