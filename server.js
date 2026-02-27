require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');

const apiRoutes = require('./backend/routes/api');
const db = require('./backend/config/db');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// --- Database Initialization (Schema Setup) ---
// This part stays here or in a setup script to ensure the DB is ready on startup
db.exec(`
  CREATE TABLE IF NOT EXISTS waitlist (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    segment TEXT DEFAULT 'founder',
    source TEXT DEFAULT 'website',
    organisation TEXT,
    city TEXT,
    status TEXT DEFAULT 'Active',
    tags TEXT DEFAULT '[]',
    ip_address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS contact_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    organisation TEXT,
    message TEXT NOT NULL,
    segment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS partner_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    organisation_name TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    partner_type TEXT NOT NULL,
    website TEXT,
    message TEXT,
    status TEXT DEFAULT 'Pending Review',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS institution_pipeline (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    waitlist_id INTEGER,
    organisation_name TEXT NOT NULL,
    contact_name TEXT,
    email TEXT,
    stage TEXT DEFAULT 'Signed Up',
    city TEXT,
    cohort_size INTEGER,
    potential_mrr INTEGER,
    notes TEXT,
    last_moved_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(waitlist_id) REFERENCES waitlist(id)
  );

  CREATE TABLE IF NOT EXISTS launch_readiness (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,
    item_key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    is_completed INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS page_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS admin_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'Super Admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS page_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    page TEXT NOT NULL,
    referrer TEXT,
    user_agent TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Create Default Admin if it doesn't exist
const adminCount = db.prepare('SELECT count(*) as count FROM admin_users').get().count;
if (adminCount === 0) {
  const hash = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'changeme123', 12);
  db.prepare('INSERT INTO admin_users (email, password_hash) VALUES (?, ?)').run(
    process.env.ADMIN_EMAIL || 'admin@dyndox.in',
    hash
  );
  console.log('Default admin user created.');
}

// --- Middleware ---
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      // Avoid forcing HTTP asset requests to HTTPS on temporary/non-matching cert domains.
      "upgrade-insecure-requests": null,
      "img-src": ["'self'", "data:", "https:"],
      "script-src": ["'self'", "'unsafe-inline'", "https://cdnjs.cloudflare.com"],
    },
  },
}));

const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- API Routes ---
app.use('/api', apiRoutes);

// --- Static Files ---
app.use(express.static(path.join(__dirname, 'public')));
app.use('/pages', express.static(path.join(__dirname, 'pages')));
app.use(express.static(path.join(__dirname, 'pages')));

// --- HTML Page Routes ---
app.get('/:page?', (req, res) => {
  let page = req.params.page || 'index';
  const filePath = path.join(__dirname, 'pages', `${page}.html`);

  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    const indexWithHash = path.join(__dirname, 'pages', 'index.html');
    if (page === 'index' && fs.existsSync(indexWithHash)) {
      res.sendFile(indexWithHash);
    } else {
      res.status(404).sendFile(path.join(__dirname, 'pages', '404.html'));
    }
  }
});

// --- Centralized Error Handling ---
app.use((err, req, res, next) => {
  console.error('SERVER ERROR:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    error: err.name || 'InternalServerError',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong on our end.'
  });
});

// --- Server Start ---
app.listen(PORT, () => {
  console.log(`DYNDOX AI server running at http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
