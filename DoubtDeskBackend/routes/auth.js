const express = require('express');
const authService = require('../services/authService');
const emailService = require('../services/emailService');

const router = express.Router();

router.post('/register/student', async (req, res) => {
  try {
    const result = await authService.registerStudent(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/register/teacher', async (req, res) => {
  try {
    const result = await authService.registerTeacher(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/register/admin', async (req, res) => {
  try {
    const result = await authService.registerAdmin(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await authService.requestPasswordReset(email);
    
    // Send OTP email
    try {
      await emailService.sendOtpEmail(email, result.otp);
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
    }
    
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    res.status(200).json({ verified: result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const result = await authService.updatePassword(email, newPassword);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
