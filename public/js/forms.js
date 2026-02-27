document.addEventListener('DOMContentLoaded', () => {
    const waitlistForms = document.querySelectorAll('.waitlist-form');
    waitlistForms.forEach(form => form.addEventListener('submit', handleWaitlistJoin));
    bindWaitlistSegmentSelector();
    bindJoinListButtons();
    handleJoinIntentFromUrl();
    loadWaitlistCount();

    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
});

function bindJoinListButtons() {
    // Only target non-submit Join buttons (nav/mobile CTA buttons).
    const joinButtons = document.querySelectorAll('button.btn-join:not([type="submit"])');
    joinButtons.forEach(button => {
        button.addEventListener('click', () => {
            const form = document.querySelector('.waitlist-form');
            if (form) {
                focusWaitlistForm(form);
                return;
            }

            // Fallback for pages without embedded waitlist form.
            window.location.href = '/?intent=join-list';
        });
    });
}

function handleJoinIntentFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const intent = params.get('intent');
    if (!intent || intent !== 'join-list') {
        return;
    }

    const form = document.querySelector('#join-list-form') || document.querySelector('.waitlist-form');
    if (form) {
        focusWaitlistForm(form);
    }
}

function bindWaitlistSegmentSelector() {
    const segmentPills = document.querySelectorAll('.audience-pills .pill[data-segment]');
    if (!segmentPills.length) return;

    const form = document.querySelector('#join-list-form') || document.querySelector('.waitlist-form');
    if (!form) return;

    const setActiveSegment = (segment) => {
        form.setAttribute('data-segment', segment);
        segmentPills.forEach(pill => pill.classList.toggle('active', pill.dataset.segment === segment));
    };

    segmentPills.forEach(pill => {
        pill.addEventListener('click', () => setActiveSegment(pill.dataset.segment));
    });

    const initiallyActive = Array.from(segmentPills).find(pill => pill.classList.contains('active'));
    setActiveSegment(initiallyActive?.dataset.segment || 'founder');
}

async function loadWaitlistCount() {
    try {
        const response = await fetch('/api/waitlist/count');
        const data = await response.json();
        if (typeof data.count === 'number') {
            updateWaitlistCount(data.count);
        }
    } catch (error) {
        console.error('Unable to fetch waitlist count:', error);
    }
}

function updateWaitlistCount(count) {
    const safeCount = Number.isFinite(Number(count)) ? Number(count) : 0;
    const formatted = new Intl.NumberFormat('en-IN').format(safeCount);
    document.querySelectorAll('.waitlist-count').forEach(el => {
        el.textContent = formatted;
    });
}

function focusWaitlistForm(form) {
    form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const emailInput = form.querySelector('input[type="email"]');
    if (emailInput) {
        setTimeout(() => emailInput.focus(), 300);
    }
}

async function handleWaitlistJoin(e) {
    e.preventDefault();
    const form = e.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitBtn = form.querySelector('button');
    const originalBtnText = submitBtn.innerHTML;

    if (!emailInput.value) return;

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Joining...';

    // Get Tracking Data
    const utm_source = sessionStorage.getItem('utm_source') || '';
    const utm_medium = sessionStorage.getItem('utm_medium') || '';
    const utm_campaign = sessionStorage.getItem('utm_campaign') || '';
    const segment = form.getAttribute('data-segment') || 'founder';
    const source = window.location.pathname;

    try {
        const response = await fetch('/api/waitlist/join', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: emailInput.value,
                segment: segment,
                source: source,
                utm_source: utm_source,
                utm_medium: utm_medium,
                utm_campaign: utm_campaign
            })
        });
        const data = await response.json();

        if (data.success) {
            submitBtn.innerHTML = '✓ Success!';
            submitBtn.style.background = '#2ecc71';
            form.reset();
            updateWaitlistCount(data.count);
        } else {
            alert(data.message || 'Error joining waitlist.');
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
        }
    } catch (err) {
        console.error(err);
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;
    }
}

async function handleContactSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Add tracking
    data.utm_source = sessionStorage.getItem('utm_source') || '';
    data.segment = form.getAttribute('data-segment') || 'general';

    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';
    }

    try {
        const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        const result = await res.json();
        if (result.success) {
            form.innerHTML = `<div style="padding:40px; text-align:center; background:#FAFAF8; border-radius:12px;">
                <h3 style="font-family:'Fraunces'; margin-bottom:12px;">Message Received</h3>
                <p style="color:var(--mid-grey);">${result.message}</p>
            </div>`;
        }
    } catch (e) {
        alert('Failed to send message.');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = 'Send Message';
        }
    }
}
