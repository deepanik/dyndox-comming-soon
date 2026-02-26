const db = require('../config/db');
const { exportToCSV } = require('../services/exportService');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const login = (req, res) => {
    const { email, password } = req.body;
    try {
        const user = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email);
        if (user && bcrypt.compareSync(password, user.password_hash)) {
            const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'fallback_secret', { expiresIn: '8h' });
            res.json({ success: true, token });
        } else {
            res.status(401).json({ success: false, error: 'invalid_credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const getDetailedStats = (req, res) => {
    try {
        const stats = {
            total_waitlist: db.prepare('SELECT count(*) as count FROM waitlist').get().count,
            today_signups: db.prepare("SELECT count(*) as count FROM waitlist WHERE date(created_at, 'localtime') = date('now', 'localtime')").get().count,
            founders: db.prepare("SELECT count(*) as count FROM waitlist WHERE segment = 'founder'").get().count,
            institutions: db.prepare("SELECT count(*) as count FROM waitlist WHERE segment = 'institution'").get().count,
            incubators: db.prepare("SELECT count(*) as count FROM waitlist WHERE segment = 'incubator'").get().count,
            top_referral: db.prepare("SELECT utm_source, count(*) as count FROM page_views WHERE utm_source != '' GROUP BY utm_source ORDER BY count DESC LIMIT 1").get() || { utm_source: 'Direct', count: 0 },
            recent_signups: db.prepare("SELECT name, email, segment, source, created_at FROM waitlist ORDER BY created_at DESC LIMIT 20").all(),
            segment_distribution: db.prepare("SELECT segment, count(*) as count FROM waitlist GROUP BY segment").all()
        };
        res.json(stats);
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const getWaitlist = (req, res) => {
    const { search, segment, status, source } = req.query;
    let query = "SELECT * FROM waitlist WHERE 1=1";
    const params = [];

    if (search) {
        query += " AND (email LIKE ? OR name LIKE ? OR organisation LIKE ?)";
        params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (segment && segment !== 'All') {
        query += " AND segment = ?";
        params.push(segment);
    }
    if (status && status !== 'All') {
        query += " AND status = ?";
        params.push(status);
    }
    if (source && source !== 'All') {
        query += " AND source = ?";
        params.push(source);
    }

    query += " ORDER BY created_at DESC";
    try {
        const list = db.prepare(query).all(...params);
        res.json(list);
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const exportWaitlist = (req, res) => {
    try {
        const data = db.prepare('SELECT * FROM waitlist ORDER BY created_at DESC').all();
        if (data.length === 0) return res.status(404).json({ error: 'No data to export' });

        const headers = Object.keys(data[0]);
        const csv = exportToCSV(data, headers);

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=waitlist_export.csv');
        res.status(200).send(csv);
    } catch (err) {
        console.error('Export Error:', err);
        res.status(500).json({ error: 'Failed to generate export' });
    }
};

const getPipeline = (req, res) => {
    try {
        const pipeline = db.prepare("SELECT * FROM institution_pipeline ORDER BY last_moved_at DESC").all();
        res.json(pipeline);
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const updatePipeline = (req, res) => {
    const { stage, notes, cohort_size, potential_mrr } = req.body;
    try {
        db.prepare("UPDATE institution_pipeline SET stage = COALESCE(?, stage), notes = COALESCE(?, notes), cohort_size = COALESCE(?, cohort_size), potential_mrr = COALESCE(?, potential_mrr), last_moved_at = CURRENT_TIMESTAMP WHERE id = ?").run(
            stage, notes, cohort_size, potential_mrr, req.params.id
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const getPartners = (req, res) => {
    try {
        const apps = db.prepare("SELECT * FROM partner_applications ORDER BY created_at DESC").all();
        res.json(apps);
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const getReadiness = (req, res) => {
    try {
        const items = db.prepare("SELECT * FROM launch_readiness").all();
        res.json(items);
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const updateReadiness = (req, res) => {
    const { is_completed } = req.body;
    try {
        db.prepare("UPDATE launch_readiness SET is_completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?").run(
            is_completed ? 1 : 0, req.params.id
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const getSettings = (req, res) => {
    try {
        const settings = db.prepare("SELECT * FROM page_settings").all();
        const formatted = {};
        settings.forEach(s => formatted[s.key] = s.value);
        res.json(formatted);
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

const updateSettings = (req, res) => {
    const settings = req.body;
    try {
        const upsert = db.prepare("INSERT OR REPLACE INTO page_settings (key, value, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)");
        db.transaction(() => {
            for (const [key, val] of Object.entries(settings)) {
                upsert.run(key, String(val));
            }
        })();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: 'server_error' });
    }
};

module.exports = {
    login,
    getDetailedStats,
    getWaitlist,
    exportWaitlist,
    getPipeline,
    updatePipeline,
    getPartners,
    getReadiness,
    updateReadiness,
    getSettings,
    updateSettings
};
