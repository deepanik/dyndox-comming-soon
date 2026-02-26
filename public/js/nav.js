function initNav() {
    const nav = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const mobileOverlay = document.querySelector('.mobile-overlay');
    const closeOverlay = document.querySelector('.close-overlay');
    const body = document.body;

    if (!nav) return;

    const isDarkHero = body.getAttribute('data-dark-hero') === 'true';
    const scrollThreshold = 80;
    let ticking = false;

    // Scroll Logic
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNav(nav, isDarkHero, scrollThreshold);
                ticking = false;
            });
            ticking = true;
        }
    });

    // Mobile Menu
    if (hamburger && mobileOverlay && closeOverlay) {
        hamburger.addEventListener('click', () => {
            mobileOverlay.classList.add('active');
            body.style.overflow = 'hidden';
        });

        closeOverlay.addEventListener('click', () => {
            mobileOverlay.classList.remove('active');
            body.style.overflow = '';
        });

        // Close on link click
        mobileOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileOverlay.classList.remove('active');
                body.style.overflow = '';
            });
        });
    }

    // Initial State
    updateNav(nav, isDarkHero, scrollThreshold);
}

function updateNav(nav, isDarkHero, threshold) {
    if (window.scrollY > threshold) {
        nav.classList.add('navbar--scrolled');
        // If it was transparent on dark hero, making it opaque white
        if (isDarkHero) {
            nav.style.background = 'rgba(255, 255, 255, 0.98)';
            nav.style.borderColor = 'var(--border)';
        }
    } else {
        nav.classList.remove('navbar--scrolled');
        if (isDarkHero) {
            nav.style.background = 'transparent';
            nav.style.borderColor = 'transparent';
        } else {
            nav.style.background = 'rgba(255, 255, 255, 0.85)';
        }
    }
}

document.addEventListener('DOMContentLoaded', initNav);
