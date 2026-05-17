const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

// Internal Middleware
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const goalRoutes = require('./routes/goalRoutes');
const managementRoutes = require('./routes/managementRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Initialize Express
const app = express();

// ==========================================
// GLOBAL MIDDLEWARES
// ==========================================

// 1. Security Headers (Best for production)
app.use(helmet());

// 2. Logging (Only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// 3. CORS - Frontend integration ke liye
app.use(cors({
    origin:'http://localhost:3000', 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']
}));

// 4. Body Parsers (Payload limit set to 16kb for safety)
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// 5. Cookie Parser
app.use(cookieParser());

// ==========================================
// ROOT & HEALTH ROUTES
// ==========================================

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'GoalSync (AlignX) Backend API Running Successfully'
    });
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'Active',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

// ==========================================
// API ROUTES (VERSION 1)
// ==========================================

// Versioning ensures future updates don't break the current frontend
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/goals', goalRoutes);
app.use('/api/v1/management', managementRoutes);
app.use('/api/v1/admin', adminRoutes);

// ==========================================
// ERROR HANDLING
// ==========================================

// 404 handler for non-existent routes
app.use((req, res, next) => {
    const error = new Error(`Route not found - ${req.originalUrl}`);
    res.status(404);
    next(error);
});

// Global Error Handler (must be the last middleware)
app.use(errorHandler);

module.exports = app;