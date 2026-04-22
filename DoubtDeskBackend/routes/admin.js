const express = require('express');
const adminService = require('../services/adminService');
const authService = require('../services/authService');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const result = await authService.registerAdmin(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/students', async (req, res) => {
  try {
    const students = await adminService.getAllStudents();
    res.status(200).json(students);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/students/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    const result = await adminService.toggleStudentStatus(parseInt(userId), isActive);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/teachers', async (req, res) => {
  try {
    const teachers = await adminService.getAllTeachers();
    res.status(200).json(teachers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/teachers/:userId/status', async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    const result = await adminService.toggleTeacherStatus(parseInt(userId), isActive);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/questions', async (req, res) => {
  try {
    const questions = await adminService.getAllQuestions();
    res.status(200).json(questions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/questions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await adminService.deleteQuestion(parseInt(id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/moneyflow', async (req, res) => {
  try {
    const data = await adminService.getMoneyFlowData();
    res.status(200).json(data);
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
    const profile = await adminService.getProfile(email);
    res.status(200).json(profile);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
