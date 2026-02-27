const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

// Controllers
const waitlistController = require('../controllers/waitlistController');
const adminController = require('../controllers/adminController');
const trackingController = require('../controllers/trackingController');
const publicController = require('../controllers/publicController');
const contactController = require('../controllers/contactController');

// Middleware
const { authenticateJWT } = require('../middleware/auth');
const rateLimit = require('express-rate-limit');

// Rate Limiters
const waitlistLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, error: 'already_registered', message: 'Too many attempts. Please try again later.' }
});

// --- Public Routes ---

// Waitlist
router.post('/waitlist/join', waitlistLimiter, [
    body('email').isEmail().normalizeEmail(),
    body('name').trim().escape()
], waitlistController.joinWaitlist);

router.get('/waitlist/count', waitlistController.getWaitlistCount);

// Settings
router.get('/settings', publicController.getPublicSettings);

// Contact & Partners
router.post('/contact', contactController.submitContact);
router.post('/partners/apply', contactController.applyPartner);

// Tracking
router.post('/track', trackingController.trackPageView);

// Auth
router.post('/admin/login', adminController.login);

// --- Admin Routes (Protected) ---

router.get('/admin/detailed-stats', authenticateJWT, adminController.getDetailedStats);
router.get('/admin/waitlist', authenticateJWT, adminController.getWaitlist);
router.get('/admin/waitlist/export', authenticateJWT, adminController.exportWaitlist); // NEW: CSV Export
router.get('/admin/pipeline', authenticateJWT, adminController.getPipeline);
router.patch('/admin/pipeline/:id', authenticateJWT, adminController.updatePipeline);
router.get('/admin/partners', authenticateJWT, adminController.getPartners);
router.get('/admin/readiness', authenticateJWT, adminController.getReadiness);
router.patch('/admin/readiness/:id', authenticateJWT, adminController.updateReadiness);
router.get('/admin/settings', authenticateJWT, adminController.getSettings);
router.post('/admin/settings', authenticateJWT, adminController.updateSettings);

// --- Error Handling for API ---
router.use((req, res) => {
    res.status(404).json({ success: false, error: 'not_found', message: 'API endpoint not found.' });
});

module.exports = router;
