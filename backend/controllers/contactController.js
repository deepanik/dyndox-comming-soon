const db = require('../config/db');
const { sendAdminNotification } = require('../services/emailService');

const submitContact = (req, res) => {
    const { name, email, organisation, message, segment } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ success: false, error: 'missing_fields' });
    }
    try {
        db.prepare('INSERT INTO contact_submissions (name, email, organisation, message, segment) VALUES (?, ?, ?, ?, ?)').run(
            name, email, organisation || '', message, segment || ''
        );
        sendAdminNotification('Contact Submission', { name, email, organisation, message, segment });
        res.json({ success: true, message: "Message received. We'll be in touch within 24 hours." });
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const applyPartner = (req, res) => {
    const { organisation_name, contact_name, email, partner_type, website, message } = req.body;
    if (!organisation_name || !contact_name || !email || !partner_type) {
        return res.status(400).json({ success: false, error: 'missing_fields' });
    }
    try {
        db.prepare('INSERT INTO partner_applications (organisation_name, contact_name, email, partner_type, website, message) VALUES (?, ?, ?, ?, ?, ?)').run(
            organisation_name, contact_name, email, partner_type, website || '', message || ''
        );
        sendAdminNotification('Partner Application', { organisation_name, contact_name, email, partner_type });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

module.exports = {
    submitContact,
    applyPartner
};
