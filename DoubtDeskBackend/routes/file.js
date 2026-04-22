const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const fileService = require('../services/fileService');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }

    const result = fileService.storeFile(req.file);
    res.status(201).json({
      ...result,
      url: result.fileUrl
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/download/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = fileService.getFile(fileName);

    res.download(filePath, fileName, (err) => {
      if (err) {
        res.status(400).json({ error: 'File download failed' });
      }
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
