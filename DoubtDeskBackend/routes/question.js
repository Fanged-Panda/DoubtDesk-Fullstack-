const express = require('express');
const multer = require('multer');
const questionService = require('../services/questionService');
const fileService = require('../services/fileService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const getRequestData = (req) => {
  if (req.body && typeof req.body.data === 'string') {
    try {
      return JSON.parse(req.body.data);
    } catch {
      return {};
    }
  }

  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    return req.body;
  }

  return {};
};

router.post('/', upload.array('attachments', 10), async (req, res) => {
  try {
    const data = getRequestData(req);
    
    if (req.files && req.files.length > 0) {
      data.attachments = req.files.map(file => {
        const stored = fileService.storeFile(file);
        return stored;
      });
    }

    const result = await questionService.createQuestion(data);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/by-student', async (req, res) => {
  try {
    const { email, courseName, page = 0, size = 10 } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter required' });
    }

    let result;
    if (courseName) {
      result = await questionService.getQuestionsByStudentEmailAndCourse(
        email,
        courseName,
        parseInt(page),
        parseInt(size)
      );
    } else {
      result = await questionService.getQuestionsByStudentEmail(
        email,
        parseInt(page),
        parseInt(size)
      );
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/solved-by-teacher', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter required' });
    }
    const result = await questionService.getSolvedQuestionsByTeacher(email);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/solve', upload.array('attachments', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const data = getRequestData(req);

    if (req.files && req.files.length > 0) {
      data.attachments = req.files.map(file => {
        const stored = fileService.storeFile(file);
        return stored;
      });
    }

    const result = await questionService.solveQuestion(parseInt(id), data);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/:id/solve', upload.array('attachments', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const data = getRequestData(req);

    if (req.files && req.files.length > 0) {
      data.attachments = req.files.map(file => {
        const stored = fileService.storeFile(file);
        return stored;
      });
    }

    const result = await questionService.editSolution(parseInt(id), data);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/status/satisfied', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await questionService.markQuestionAsSatisfied(parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/follow-up', upload.array('attachments', 10), async (req, res) => {
  try {
    const { id } = req.params;
    const data = getRequestData(req);

    if (req.files && req.files.length > 0) {
      data.attachments = req.files.map(file => {
        const stored = fileService.storeFile(file);
        return stored;
      });
    }

    const result = await questionService.createFollowUpQuestion(parseInt(id), data);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/pending', async (req, res) => {
  try {
    const { email, page = 0, size = 10 } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter required' });
    }

    const result = await questionService.getPendingQuestionsForTeacher(
      email,
      parseInt(page),
      parseInt(size)
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get pending questions grouped by course and subject
router.get('/grouping/summary', async (req, res) => {
  try {
    const result = await questionService.getPendingQuestionsByGrouping();
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get pending questions by course and subject
router.get('/grouping/list', async (req, res) => {
  try {
    const { courseId, subjectId, page = 0, size = 10 } = req.query;
    const result = await questionService.getPendingQuestionsByGroupId(
      courseId && courseId !== 'null' ? parseInt(courseId) : null,
      subjectId && subjectId !== 'null' ? parseInt(subjectId) : null,
      parseInt(page),
      parseInt(size)
    );
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await questionService.getQuestionById(parseInt(id));
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
