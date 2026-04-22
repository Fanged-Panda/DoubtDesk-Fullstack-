const express = require('express');
const teacherService = require('../services/teacherService');
const authService = require('../services/authService');

const router = express.Router();

router.post('/register/teacher', async (req, res) => {
  try {
    const result = await authService.registerTeacher(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/profile', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter required' });
    }
    const profile = await teacherService.getProfile(email);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
