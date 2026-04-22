const nodemailer = require('nodemailer');

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendSimpleEmail(email, subject, body) {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject,
        html: body
      });
      return { message: 'Email sent successfully' };
    } catch (error) {
      console.error('Email send failed:', error);
      throw error;
    }
  }

  async sendOtpEmail(email, otp) {
    const subject = 'Password Reset OTP';
    const body = `
      <h2>Password Reset Request</h2>
      <p>Your OTP for password reset is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 2 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `;
    return this.sendSimpleEmail(email, subject, body);
  }
}

module.exports = new EmailService();
