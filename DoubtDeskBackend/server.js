const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const db = require('./config/database');
const authRoutes = require('./routes/auth');
const studentRoutes = require('./routes/student');
const teacherRoutes = require('./routes/teacher');
const questionRoutes = require('./routes/question');
const courseRoutes = require('./routes/course');
const paymentRoutes = require('./routes/payment');
const adminRoutes = require('./routes/admin');
const fileRoutes = require('./routes/file');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URLS?.split(',') || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true
}));

app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({ limit: '500mb', extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/files', fileRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error' 
  });
});

// Database sync and start server
const PORT = process.env.PORT || 3001;

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database sync failed:', err);
});

module.exports = app;
