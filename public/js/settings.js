/**
 * DYNDOX AI Dynamic Settings
 * Fetches and applies global configurations to the DOM.
 */

async function applyGlobalSettings() {
    try {
        const res = await fetch('/api/settings');
        const settings = await res.json();

        // 1. Announcement Bar
        const announceText = document.querySelector('.announcement-text');
        if (announceText && settings.announcement_bar_text) {
            announceText.innerText = settings.announcement_bar_text;
        }

        const announceBar = document.querySelector('.announcement-bar');
        if (announceBar) {
            announceBar.style.display = settings.announcement_bar_enabled === 'true' ? 'block' : 'none';
        }

        // 2. Dynamic Hero Content (if elements exist)
        const hero1 = document.getElementById('dynamic-hero-1');
        if (hero1 && settings.hero_headline_1) hero1.innerText = settings.hero_headline_1;

        const hero2 = document.getElementById('dynamic-hero-2');
        if (hero2 && settings.hero_headline_2) hero2.innerText = settings.hero_headline_2;

        const heroSub = document.getElementById('dynamic-hero-sub');
        if (heroSub && settings.hero_subtext) heroSub.innerText = settings.hero_subtext;

    } catch (e) {
        console.error('Failed to load settings', e);
    }
}

document.addEventListener('DOMContentLoaded', applyGlobalSettings);
