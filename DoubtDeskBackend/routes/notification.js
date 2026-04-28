const express = require('express');
const { Notification } = require('../models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter required' });
    }

    const notifications = await Notification.findAll({
      where: { recipientEmail: email },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { recipientEmail, questionId, message, type } = req.body || {};
    if (!recipientEmail || !message) {
      return res.status(400).json({ error: 'recipientEmail and message are required' });
    }

    const notification = await Notification.create({
      recipientEmail,
      questionId: questionId || null,
      message,
      type: type || 'solution',
      read: false
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.patch('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByPk(parseInt(id));
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    await notification.update({ read: true });
    res.status(200).json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res.status(400).json({ error: 'Email query parameter required' });
    }

    await Notification.destroy({ where: { recipientEmail: email } });
    res.status(200).json({ message: 'Notifications cleared' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
