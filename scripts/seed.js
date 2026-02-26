const db = require('../backend/config/db');
const bcrypt = require('bcryptjs');

console.log('--- SEEDING DATABASE ---');

try {
    // 1. Clear existing data (optional, but good for a fresh start in dev)
    db.prepare('DELETE FROM waitlist').run();
    db.prepare('DELETE FROM page_views').run();
    db.prepare('DELETE FROM contact_submissions').run();

    // 2. Seed Waitlist
    const insertWaitlist = db.prepare('INSERT INTO waitlist (email, name, segment, source, organisation, city, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)');

    const segments = ['founder', 'institution', 'incubator'];
    const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'San Francisco', 'London'];

    for (let i = 0; i < 50; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        insertWaitlist.run(
            `user${i}@example.com`,
            `Founder ${i}`,
            segments[Math.floor(Math.random() * segments.length)],
            Math.random() > 0.5 ? 'website' : 'referral',
            `Startup ${i} Inc.`,
            cities[Math.floor(Math.random() * cities.length)],
            date.toISOString()
        );
    }
    console.log('[✓] Seeded 50 waitlist entries.');

    // 3. Seed Page Views
    const insertPageView = db.prepare('INSERT INTO page_views (page, referrer, utm_source, utm_medium, created_at) VALUES (?, ?, ?, ?, ?)');
    const utmSources = ['', 'google', 'twitter', 'linkedin', 'newsletter'];

    for (let i = 0; i < 200; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));

        insertPageView.run(
            Math.random() > 0.8 ? '/incubators' : '/index',
            'https://google.com',
            utmSources[Math.floor(Math.random() * utmSources.length)],
            'social',
            date.toISOString()
        );
    }
    console.log('[✓] Seeded 200 page view records.');

    // 4. Seed Launch Readiness
    const readinessItems = [
        { category: 'General', key: 'waitlist_v1', label: 'Waitlist Form Launch' },
        { category: 'General', key: 'admin_panel', label: 'Admin Dashboard' },
        { category: 'Content', key: 'incubators_page', label: 'Incubators Page Content' },
        { category: 'Technical', key: 'email_service', label: 'Automated Email Service' }
    ];

    const insertReadiness = db.prepare('INSERT OR IGNORE INTO launch_readiness (category, item_key, label, is_completed) VALUES (?, ?, ?, ?)');
    readinessItems.forEach(item => {
        insertReadiness.run(item.category, item.key, item.label, Math.random() > 0.3 ? 1 : 0);
    });
    console.log('[✓] Seeded launch readiness items.');

    console.log('--- SEEDING COMPLETE ---');
} catch (err) {
    console.error('[✗] Seeding failed:', err);
}
