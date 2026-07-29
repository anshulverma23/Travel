const nodemailer = require("nodemailer");

// Creates a reusable SMTP transporter from env vars (works with Gmail, SendGrid SMTP, etc.)
const createTransporter = () =>
  nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

/**
 * Sends an email. Fails silently (logs only) so a broken SMTP config never
 * blocks a core flow like registration or booking creation.
 * @param {{to: string, subject: string, html: string, text?: string}} options
 */
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"India Travel" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]+>/g, ""),
    });
    return true;
  } catch (error) {
    console.error("sendEmail error:", error.message);
    return false;
  }
};

// -------- Reusable email templates --------

const emailTemplates = {
  verifyEmail: (name, url) => `
    <h2>Hi ${name},</h2>
    <p>Welcome to India Travel! Please verify your email address by clicking the link below:</p>
    <p><a href="${url}" style="background:#1a5f4a;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Verify Email</a></p>
    <p>This link expires in 24 hours.</p>`,

  resetPassword: (name, url) => `
    <h2>Hi ${name},</h2>
    <p>You requested a password reset. Click the link below to set a new password:</p>
    <p><a href="${url}" style="background:#1a5f4a;color:#fff;padding:10px 20px;text-decoration:none;border-radius:6px;">Reset Password</a></p>
    <p>If you didn't request this, you can safely ignore this email. This link expires in 10 minutes.</p>`,

  bookingConfirmation: (name, booking) => `
    <h2>Hi ${name},</h2>
    <p>Your booking <strong>#${booking.invoiceNumber}</strong> is confirmed!</p>
    <p><strong>Check-in:</strong> ${booking.checkIn ? new Date(booking.checkIn).toDateString() : "N/A"}</p>
    <p><strong>Check-out:</strong> ${booking.checkOut ? new Date(booking.checkOut).toDateString() : "N/A"}</p>
    <p><strong>Total Amount:</strong> ₹${booking.pricing?.totalAmount}</p>
    <p>Thank you for booking with India Travel. Have a wonderful trip!</p>`,
};

module.exports = { sendEmail, emailTemplates };
