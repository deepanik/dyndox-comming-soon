const db = require('../config/db');

const trackPageView = (req, res) => {
    const { page, referrer, utm_source, utm_medium, utm_campaign } = req.body;
    try {
        db.prepare('INSERT INTO page_views (page, referrer, user_agent, utm_source, utm_medium, utm_campaign) VALUES (?, ?, ?, ?, ?, ?)').run(
            page || 'unknown', referrer || '', req.get('User-Agent'), utm_source || '', utm_medium || '', utm_campaign || ''
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

module.exports = {
    trackPageView
};
