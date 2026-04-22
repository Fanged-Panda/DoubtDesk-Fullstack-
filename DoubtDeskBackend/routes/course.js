const express = require('express');
const courseService = require('../services/courseService');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const courses = await courseService.getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const result = await courseService.createCourse(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await courseService.deleteCourse(parseInt(id));
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
