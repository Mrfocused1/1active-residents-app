require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const reportRoutes = require('./routes/reports');
const notificationRoutes = require('./routes/notifications');
const pushTokenRoutes = require('./routes/pushTokens');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(timestamp + ' - ' + req.method + ' ' + req.path);
  next();
});

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'Active Residents API', 
    version: '1.0.0',
    status: 'running' 
  });
});

app.get('/api', (req, res) => {
  res.json({ 
    message: 'Active Residents API', 
    version: '1.0.0',
    endpoints: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'GET /api/auth/me',
      'PUT /api/auth/update-profile',
      'PUT /api/auth/change-password',
      'DELETE /api/auth/delete-account',
      'POST /api/auth/forgot-password',
      'POST /api/auth/reset-password/:token',
      'GET /api/reports',
      'POST /api/reports',
      'GET /api/notifications',
      'POST /api/push-tokens'
    ]
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/push-tokens', pushTokenRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    if (process.env.MONGODB_URI) {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('Connected to MongoDB');
    } else {
      console.log('Running without MongoDB (using in-memory storage)');
    }
    
    app.listen(PORT, () => {
      console.log('Server running on port ' + PORT);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
