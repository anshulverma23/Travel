const asyncHandler = require("express-async-handler");
const { sendEmail } = require("../utils/sendEmail");

// @desc    Send a contact form message to the site admin
// @route   POST /api/contact
// @access  Public
const sendContactMessage = asyncHandler(async (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Please provide your name, email, and a message");
  }

  const adminEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER;
  if (!adminEmail) {
    res.status(503);
    throw new Error("Contact form is not configured on the server yet");
  }

  const delivered = await sendEmail({
    to: adminEmail,
    subject: `[Contact Form] ${subject || "New message"} - from ${name}`,
    html: `
      <p><strong>From:</strong> ${name} (${email})</p>
      <p><strong>Subject:</strong> ${subject || "N/A"}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, "<br/>")}</p>`,
  });

  if (!delivered) {
    res.status(502);
    throw new Error("Could not send your message right now. Please try again later.");
  }

  res.status(200).json({ success: true, message: "Thanks! We'll get back to you soon." });
});

module.exports = { sendContactMessage };
