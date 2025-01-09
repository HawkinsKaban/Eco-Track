// src/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./src/routes/auth.routes');
const reportRoutes = require('./src/routes/report.routes');
const activityRoutes = require('./src/routes/activity.routes');
const userRoutes = require('./src/routes/user.routes');

const app = express();

// Middleware
app.use(cors()); // Mengaktifkan CORS untuk semua origin
app.use(express.json()); // Middleware untuk parsing JSON
app.use(morgan('dev')); // Logger untuk request
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Middleware untuk melayani file statis di folder uploads

// Database connection
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecotrack', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes); // Rute untuk autentikasi
app.use('/api/reports', reportRoutes); // Rute untuk laporan
app.use('/api/activities', activityRoutes); // Rute untuk aktivitas
app.use('/api/users', userRoutes); // Rute untuk pengguna

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

// Create necessary directories if they don't exist
const uploadDir = path.join(__dirname, 'uploads');
const profileDir = path.join(uploadDir, 'profiles');
const reportsDir = path.join(uploadDir, 'reports');

[uploadDir, profileDir, reportsDir].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Directory created: ${dir}`);
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
