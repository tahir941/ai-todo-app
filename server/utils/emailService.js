const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a Nodemailer transporter using Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,  // Your Gmail address
        pass: process.env.EMAIL_PASS   // App password or Gmail password
    }
});

/**
 * Send a reset password email to the user
 * @param {string} to - Recipient email address
 * @param {string} resetLink - Password reset link
 */
async function sendResetEmail(to, resetLink) {
    const mailOptions = {
        from: `"AI To-Do Assistant" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Password Reset Request',
        text: `You requested a password reset. Click this link to reset your password: ${resetLink}`,
        html: `
            <p>You requested a password reset.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>If you did not request this, please ignore this email.</p>
        `
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent:', info.response);
    } catch (err) {
        console.error('Error sending reset email:', err);
        throw new Error('Unable to send reset email');
    }
}

module.exports = { sendResetEmail };
