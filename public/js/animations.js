document.addEventListener('DOMContentLoaded', () => {
    initRevealAnimations();
    initCountUpAnimations();
    initSmoothScroll();
});

function initRevealAnimations() {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active', 'visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initCountUpAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'));
                if (!isNaN(target)) {
                    animateValue(el, 0, target, 2000);
                    observer.unobserve(el);
                }
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.count-up').forEach(el => observer.observe(el));
}

function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const current = Math.floor(progress * (end - start) + start);

        let formatted = current.toLocaleString('en-IN');
        if (obj.innerText.includes('₹')) formatted = '₹' + formatted;
        if (obj.innerText.includes('%')) formatted = formatted + '%';

        obj.innerHTML = formatted;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 68,
                    behavior: 'smooth'
                });
            }
        });
    });
}
