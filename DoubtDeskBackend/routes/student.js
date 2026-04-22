const express = require('express');
const studentService = require('../services/studentService');
const authService = require('../services/authService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await authService.registerStudent(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/courses', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter required' });
    }
    const courses = await studentService.getEnrolledCourses(email);
    res.status(200).json(courses);
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
    const profile = await studentService.getProfile(email);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
