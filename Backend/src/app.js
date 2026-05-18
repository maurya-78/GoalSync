const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const { errorHandler, notFound } = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/auth');
const goalRoutes = require('./routes/goal');
const adminRoutes = require('./routes/admin');
const notificationRoutes = require('./routes/notifications');
// const cycleRoutes = require('./routes/cycles');        // jab file bane tab uncomment
// const managementRoutes = require('./routes/management'); // jab file bane tab uncomment

const app = express();

app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'https://goal-sync-ruby.vercel.app',
      'http://localhost:3000',
      'http://localhost:5173',
    ];
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    platform: 'GoalSync',
    environment: process.env.NODE_ENV,
    message: 'GoalSync Enterprise API Operational'
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'ACTIVE',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/notifications', notificationRoutes);
// app.use('/api/v1/cycles', cycleRoutes);           // baad me
// app.use('/api/v1/management', managementRoutes);  // baad me

app.use(notFound);
app.use(errorHandler);

module.exports = app;