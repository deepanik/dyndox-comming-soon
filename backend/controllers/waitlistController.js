const db = require('../config/db');
const { sendWaitlistConfirmation, sendAdminNotification } = require('../services/emailService');

const joinWaitlist = (req, res) => {
    const { email, name, segment, source, organisation, city } = req.body;

    try {
        const result = db.prepare('INSERT INTO waitlist (email, name, segment, source, organisation, city, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)').run(
            email, name || '', segment || 'founder', source || 'website', organisation || '', city || '', req.ip
        );

        // If it's an institution or incubator, also add to pipeline
        if (segment === 'institution' || segment === 'incubator') {
            db.prepare('INSERT INTO institution_pipeline (waitlist_id, organisation_name, contact_name, email, city) VALUES (?, ?, ?, ?, ?)').run(
                result.lastInsertRowid, organisation || 'Unknown', name || '', email, city || ''
            );
        }

        const count = db.prepare('SELECT count(*) as count FROM waitlist').get().count;

        // Asynchronously send confirmation email
        sendWaitlistConfirmation(email, name);
        sendAdminNotification('Waitlist Signup', { email, name, segment, organisation, city });

        res.json({ success: true, count, message: "You're on the list!" });
    } catch (err) {
        if (err.code === 'SQLITE_CONSTRAINT') {
            return res.status(400).json({ success: false, error: 'already_registered', message: 'This email is already on the waitlist.' });
        }
        console.error('Waitlist Error:', err);
        res.status(500).json({ success: false, error: 'server_error', message: 'Something went wrong on our end.' });
    }
};

const getWaitlistCount = (req, res) => {
    try {
        const count = db.prepare('SELECT count(*) as count FROM waitlist').get().count;
        res.json({ count });
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

module.exports = {
    joinWaitlist,
    getWaitlistCount
};
