document.addEventListener('DOMContentLoaded', () => {
    const waitlistForms = document.querySelectorAll('.waitlist-form');
    waitlistForms.forEach(form => form.addEventListener('submit', handleWaitlistJoin));

    const contactForm = document.getElementById('contact-form');
    if (contactForm) contactForm.addEventListener('submit', handleContactSubmit);
});

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
