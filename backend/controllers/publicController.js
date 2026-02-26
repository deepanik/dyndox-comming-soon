const db = require('../config/db');

const getPublicSettings = (req, res) => {
    const keys = [
        'hero_headline_1', 'hero_headline_2', 'hero_subtext', 'hero_cta_text',
        'announcement_bar_text', 'announcement_bar_link', 'announcement_bar_enabled',
        'waitlist_target_founders', 'target_launch_date'
    ];
    try {
        const placeholders = keys.map(() => '?').join(',');
        const settings = db.prepare(`SELECT * FROM page_settings WHERE key IN (${placeholders})`).all(...keys);
        const formatted = {};
        settings.forEach(s => formatted[s.key] = s.value);
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

module.exports = {
    getPublicSettings
};
