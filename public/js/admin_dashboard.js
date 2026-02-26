/**
 * DYNDOX AI Admin Dashboard
 * Handles all administrative logic for the pre-launch phase.
 */

class AdminDashboard {
    constructor() {
        this.token = localStorage.getItem('admin_token');
        this.currentSection = 'dashboard';
        this.charts = {};

        this.init();
    }

    async init() {
        this.setupEventListeners();

        if (this.token) {
            document.getElementById('login-overlay').style.display = 'none';
            this.loadSection('dashboard');
        }

        // Live Clock
        setInterval(() => {
            const now = new Date();
            document.getElementById('live-time').innerText = now.toLocaleTimeString();
        }, 1000);
    }

    setupEventListeners() {
        // Login
        document.getElementById('login-form').addEventListener('submit', (e) => this.handleLogin(e));

        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.getAttribute('data-section');
                this.loadSection(section);

                // Update UI active state
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                link.classList.add('active');
            });
        });

        // Logout
        document.getElementById('logout-btn').addEventListener('click', (e) => {
            e.preventDefault();
            this.logout();
        });

        // Search & Filter
        const searchInput = document.getElementById('waitlist-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.fetchWaitlist(e.target.value));
        }

        // Settings Save
        const saveBtn = document.getElementById('save-settings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                this.token = data.token;
                localStorage.setItem('admin_token', this.token);
                document.getElementById('login-overlay').style.display = 'none';
                this.loadSection('dashboard');
            } else {
                alert('Invalid credentials');
            }
        } catch (err) {
            alert('Login failed');
        }
    }

    logout() {
        localStorage.removeItem('admin_token');
        window.location.reload();
    }

    async apiFetch(url, options = {}) {
        const headers = {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        const res = await fetch(url, { ...options, headers });
        if (res.status === 401 || res.status === 403) {
            this.logout();
            throw new Error('Unauthorized');
        }
        return res.json();
    }

    async loadSection(section) {
        this.currentSection = section;

        // Show/Hide sections
        document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
        document.getElementById(`section-${section}`)?.classList.add('active');

        switch (section) {
            case 'dashboard':
                await this.fetchDashboardStats();
                break;
            case 'waitlist':
                await this.fetchWaitlist();
                break;
            case 'pipeline':
                await this.fetchPipeline();
                break;
            case 'partners':
                await this.fetchPartners();
                break;
            case 'broadcast':
                await this.fetchBroadcast();
                break;
            case 'analytics':
                await this.fetchAnalytics();
                break;
            case 'readiness':
                await this.fetchReadiness();
                break;
            case 'settings':
                await this.fetchSettings();
                break;
        }
    }

    async fetchPartners() {
        const data = await this.apiFetch('/api/admin/partners');
        const section = document.getElementById('section-partners');
        section.innerHTML = `
            <div class="header"><h1>Partner Applications</h1></div>
            <div class="data-table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Org Name</th>
                            <th>Contact</th>
                            <th>Email</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${data.map(a => `
                            <tr>
                                <td>${a.organisation_name}</td>
                                <td>${a.contact_name}</td>
                                <td>${a.email}</td>
                                <td><span class="badge" style="background:#F3E5F5">${a.partner_type}</span></td>
                                <td>${a.status}</td>
                                <td><button class="nav__cta" style="padding:4px 12px; font-size:11px; background:var(--black); color:white; border:none;">Review</button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;
    }

    async fetchBroadcast() {
        const section = document.getElementById('section-broadcast');
        section.innerHTML = `
            <div class="header"><h1>Broadcast & Emails</h1></div>
            <div style="display:grid; grid-template-columns: 1fr 2fr; gap:32px;">
                <div class="kpi-card">
                    <h3 style="font-size:14px; margin-bottom:16px;">New Campaign</h3>
                    <div style="margin-bottom:16px;">
                        <label style="display:block; font-size:12px; margin-bottom:8px;">AUDIENCE</label>
                        <select style="width:100%; padding:8px; border:1px solid var(--admin-border); border-radius:4px;">
                            <option>Entire Waitlist</option>
                            <option>Founders Only</option>
                            <option>Institutions Only</option>
                        </select>
                    </div>
                    <div style="margin-bottom:16px;">
                        <label style="display:block; font-size:12px; margin-bottom:8px;">SUBJECT</label>
                        <input type="text" style="width:100%; padding:8px; border:1px solid var(--admin-border); border-radius:4px;" placeholder="Launch Update #1">
                    </div>
                    <button class="nav__cta" style="width:100%; background:var(--black); color:white; border:none;">Compose Email</button>
                </div>
                <div class="kpi-card">
                    <h3 style="font-size:14px; margin-bottom:16px;">Automated Sequences</h3>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid var(--admin-border);">
                        <span>Welcome Sequence</span>
                        <span style="color:#2ecc71; font-weight:700;">ACTIVE</span>
                    </div>
                    <div style="display:flex; justify-content:space-between; align-items:center; padding:12px; border-bottom:1px solid var(--admin-border);">
                        <span>Institution Nurture</span>
                        <span style="color:#ffa500; font-weight:700;">DRAFT</span>
                    </div>
                </div>
            </div>
        `;
    }

    async fetchAnalytics() {
        const section = document.getElementById('section-analytics');
        section.innerHTML = `
            <div class="header"><h1>Traffic & Analytics</h1></div>
            <div style="display:grid; grid-template-columns: 1fr 1fr; gap:32px; margin-bottom:32px;">
                <div class="kpi-card" style="height:300px;">
                    <div class="kpi-label">Conversion Rate by Page</div>
                    <canvas id="conversionChart"></canvas>
                </div>
                <div class="kpi-card" style="height:300px;">
                    <div class="kpi-label">Traffic Sources</div>
                    <canvas id="sourcesChart"></canvas>
                </div>
            </div>
            <div class="kpi-card">
                <div class="kpi-label">UTM Campaign Tracker</div>
                <table style="margin-top:16px;">
                    <thead><tr><th>Campaign</th><th>Source</th><th>Clicks</th><th>Signups</th><th>CR%</th></tr></thead>
                    <tbody>
                        <tr><td>Waitlist_Bio</td><td>Instagram</td><td>452</td><td>84</td><td>18.5%</td></tr>
                        <tr><td>Launch_Post</td><td>LinkedIn</td><td>892</td><td>112</td><td>12.5%</td></tr>
                    </tbody>
                </table>
            </div>
        `;

        // Render Analytics Charts (Mock Data)
        this.renderAnalyticsCharts();
    }

    renderAnalyticsCharts() {
        const convCtx = document.getElementById('conversionChart').getContext('2d');
        new Chart(convCtx, {
            type: 'bar',
            data: {
                labels: ['Home', 'Founders', 'Institutions', 'Pricing'],
                datasets: [{ data: [12, 18, 25, 14], backgroundColor: '#1B4FD8' }]
            },
            options: { indexAxis: 'y', plugins: { legend: { display: false } } }
        });

        const sourceCtx = document.getElementById('sourcesChart').getContext('2d');
        new Chart(sourceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Direct', 'LinkedIn', 'Instagram', 'Search'],
                datasets: [{ data: [40, 30, 20, 10], backgroundColor: ['#0A0A0A', '#1B4FD8', '#f09433', '#4285F4'] }]
            }
        });
    }

    async fetchDashboardStats() {
        const data = await this.apiFetch('/api/admin/detailed-stats');

        document.getElementById('kpi-total').innerText = data.total_waitlist;
        document.getElementById('kpi-founders').innerText = data.founders;
        document.getElementById('kpi-institutions').innerText = data.institutions;
        document.getElementById('kpi-incubators').innerText = data.incubators;
        document.getElementById('kpi-today').innerText = data.today_signups;
        document.getElementById('kpi-referral').innerText = data.top_referral.utm_source || 'Direct';

        this.renderGrowthChart(data);
        this.renderLiveFeed(data.recent_signups);
    }

    renderGrowthChart(data) {
        const ctx = document.getElementById('growthChart').getContext('2d');
        if (this.charts.growth) this.charts.growth.destroy();

        // Mocking growth data for visualization
        this.charts.growth = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Signups',
                    data: [12, 19, 30, 45, 107, data.total_waitlist],
                    borderColor: '#1B4FD8',
                    tension: 0.4,
                    fill: true,
                    backgroundColor: 'rgba(27, 79, 216, 0.05)'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    y: { beginAtZero: true, grid: { color: '#E0DDD8' } },
                    x: { grid: { display: false } }
                }
            }
        });
    }

    renderLiveFeed(signups) {
        const feed = document.getElementById('live-feed');
        feed.innerHTML = signups.map(s => `
            <div style="padding: 12px; border-bottom: 1px solid var(--admin-border); animation: fadeIn 0.5s ease-out;">
                <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
                    <span style="font-weight:700;">${s.name || 'Anonymous'}</span>
                    <span style="color:var(--mid-grey); font-size:11px;">${this.timeAgo(s.created_at)}</span>
                </div>
                <div style="display:flex; gap:8px;">
                    <span class="badge badge-${s.segment}">${s.segment}</span>
                    <span style="color:var(--mid-grey); font-size:12px;">via ${s.source}</span>
                </div>
            </div>
        `).join('');
    }

    async fetchWaitlist(search = '') {
        const data = await this.apiFetch(`/api/admin/waitlist?search=${search}`);
        const tbody = document.getElementById('waitlist-table-body');

        tbody.innerHTML = data.map(s => `
            <tr>
                <td>${s.name || '—'}</td>
                <td>${s.email}</td>
                <td><span class="badge badge-${s.segment}">${s.segment}</span></td>
                <td>${s.organisation || '—'}</td>
                <td>${s.source}</td>
                <td>${new Date(s.created_at).toLocaleDateString()}</td>
                <td>${s.status}</td>
            </tr>
        `).join('');
    }

    async fetchPipeline() {
        const data = await this.apiFetch('/api/admin/pipeline');
        const board = document.getElementById('kanban-board');
        const stages = ['Signed Up', 'Contacted', 'Demo Scheduled', 'Demo Done', 'Proposal Sent', 'Converted'];

        board.innerHTML = stages.map(stage => `
            <div style="min-width: 250px; background: rgba(0,0,0,0.02); border-radius: 8px; padding: 16px;">
                <h4 style="font-size:13px; text-transform:uppercase; margin-bottom:16px;">${stage}</h4>
                <div class="cards-container" data-stage="${stage}">
                    ${data.filter(i => i.stage === stage).map(i => `
                        <div style="background:white; padding:12px; border-radius:6px; border:1px solid var(--admin-border); margin-bottom:12px; cursor:move;">
                            <div style="font-weight:700; font-size:14px; margin-bottom:4px;">${i.organisation_name}</div>
                            <div style="font-size:12px; color:var(--mid-grey);">${i.contact_name || 'No contact'}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    async fetchReadiness() {
        const data = await this.apiFetch('/api/admin/readiness');
        const settings = await this.apiFetch('/api/admin/settings');
        const stats = await this.apiFetch('/api/admin/detailed-stats');

        const container = document.getElementById('readiness-container');

        const groups = {};
        data.forEach(item => {
            if (!groups[item.category]) groups[item.category] = [];
            groups[item.category].push(item);
        });

        // Calculate Score
        let score = 0;

        // 1. Waitlist (20 pts)
        const fProg = Math.min(1, stats.founders / (parseInt(settings.waitlist_target_founders) || 1000));
        const iProg = Math.min(1, stats.institutions / (parseInt(settings.waitlist_target_institutions) || 50));
        const incProg = Math.min(1, stats.incubators / (parseInt(settings.waitlist_target_incubators) || 20));
        score += ((fProg + iProg + incProg) / 3) * 20;

        // 2-5. Categories (20 pts each)
        Object.entries(groups).forEach(([cat, items]) => {
            const completed = items.filter(i => i.is_completed).length;
            score += (completed / items.length) * 20;
        });

        const scoreColor = score < 50 ? '#ff4d4d' : (score < 75 ? '#ffa500' : '#2ecc71');

        container.innerHTML = `
            <div style="text-align:center; margin-bottom:48px; background:white; padding:40px; border-radius:16px; border:1px solid var(--admin-border);">
                <div style="font-size:64px; font-weight:700; color:${scoreColor}; font-family:'Fraunces';">${Math.round(score)}%</div>
                <div style="font-size:14px; color:var(--mid-grey); margin-top:8px;">LAUNCH READINESS SCORE</div>
                <div style="margin-top:24px; font-family:'JetBrains Mono'; color:var(--black);">
                    TARGET LAUNCH: ${settings.target_launch_date || 'Not Set'}
                </div>
            </div>
            
            ${Object.entries(groups).map(([cat, items]) => `
                <div style="margin-bottom: 40px;">
                    <h3 style="font-size:18px; margin-bottom:16px;">${cat} Readiness</h3>
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px;">
                        ${items.map(i => `
                            <div style="display:flex; align-items:center; gap:12px; padding:12px; background:white; border-radius:8px; border:1px solid var(--admin-border);">
                                <input type="checkbox" ${i.is_completed ? 'checked' : ''} 
                                    onchange="window.dashboard.toggleReadiness(${i.id}, this.checked)">
                                <span style="font-size:14px;">${i.label}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        `;
    }

    async toggleReadiness(id, is_completed) {
        await this.apiFetch(`/api/admin/readiness/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ is_completed })
        });
        this.fetchReadiness(); // Refresh score
    }

    async fetchSettings() {
        const data = await this.apiFetch('/api/admin/settings');
        const grid = document.getElementById('settings-grid');

        grid.innerHTML = Object.entries(data).map(([key, val]) => `
            <div>
                <label style="display:block; font-size:12px; font-weight:700; margin-bottom:8px;">${key.replace(/_/g, ' ').toUpperCase()}</label>
                <textarea id="setting-${key}" style="width:100%; padding:12px; border:1px solid var(--admin-border); border-radius:8px; font-family:inherit; min-height:60px;">${val}</textarea>
            </div>
        `).join('');
    }

    async saveSettings() {
        const settings = {};
        document.querySelectorAll('[id^="setting-"]').forEach(el => {
            const key = el.id.replace('setting-', '');
            settings[key] = el.value;
        });

        await this.apiFetch('/api/admin/settings', {
            method: 'POST',
            body: JSON.stringify(settings)
        });
        alert('Settings saved!');
    }

    timeAgo(dateStr) {
        const seconds = Math.floor((new Date() - new Date(dateStr)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        return `${Math.floor(hours / 24)}d ago`;
    }
}

// Initialise and attach to window for access from HTML
window.dashboard = new AdminDashboard();
