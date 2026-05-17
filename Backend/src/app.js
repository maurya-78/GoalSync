const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');

// ==========================================
// INTERNAL MIDDLEWARE
// ==========================================

const {
  errorHandler,notFound
} = require('./middleware/errorHandler');

// ==========================================
// ROUTE IMPORTS
// ==========================================

const authRoutes =
  require('./routes/authRoutes');
const goalRoutes =
  require('./routes/goalRoutes');
const cycleRoutes =
  require('./routes/cycleRoutes');
const managementRoutes =
  require('./routes/managementRoutes');
const adminRoutes =
  require('./routes/adminRoutes');

// ==========================================
// INITIALIZE EXPRESS
// ==========================================

const app = express();

// ==========================================
// SECURITY MIDDLEWARE
// ==========================================

// Helmet for enterprise headers

app.use(helmet());

// ==========================================
// DEVELOPMENT LOGGER
// ==========================================

if (

  process.env.NODE_ENV === 'development'

) {

  app.use(morgan('dev'));

}

// ==========================================
// CORS CONFIGURATION
// ==========================================

app.use(

  cors({

    origin:

      process.env.CLIENT_URL ||

      'http://localhost:3000',

    credentials: true,

    methods: [

      'GET',

      'POST',

      'PUT',

      'PATCH',

      'DELETE',

      'OPTIONS'

    ]

  })

);

// ==========================================
// BODY PARSERS
// ==========================================

app.use(

  express.json({

    limit: '16kb'

  })

);

app.use(

  express.urlencoded({

    extended: true,

    limit: '16kb'

  })

);

// ==========================================
// COOKIE PARSER
// ==========================================

app.use(cookieParser());

// ==========================================
// ROOT ROUTE
// ==========================================

app.get('/', (req, res) => {

  res.status(200).json({

    success: true,

    platform: 'GoalSync',

    environment:

      process.env.NODE_ENV,

    message:
      'GoalSync Enterprise API Operational'

  });

});

// ==========================================
// HEALTH CHECK
// ==========================================

app.get('/health', (req, res) => {

  res.status(200).json({

    success: true,

    status: 'ACTIVE',

    uptime: process.uptime(),

    timestamp:
      new Date().toISOString()

  });

});

// ==========================================
// API VERSIONING
// ==========================================

app.use(

  '/api/v1/auth',

  authRoutes

);

app.use(

  '/api/v1/goals',

  goalRoutes

);

app.use(

  '/api/v1/cycles',

  cycleRoutes

);

app.use(

  '/api/v1/management',

  managementRoutes

);

app.use(

  '/api/v1/admin',

  adminRoutes

);

// ==========================================
// 404 HANDLER
// ==========================================

app.use(notFound);

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(errorHandler);

// ==========================================
// EXPORT
// ==========================================

module.exports = app;