/**
 * DYNDOX AI Tracking System
 * Captures UTM parameters and sends page view signals.
 */

(function () {
    const tracking = {
        init() {
            this.captureUTMs();
            this.trackPageView();
        },

        captureUTMs() {
            const urlParams = new URLSearchParams(window.location.search);
            const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

            utms.forEach(param => {
                const value = urlParams.get(param);
                if (value) {
                    sessionStorage.setItem(param, value);
                }
            });
        },

        async trackPageView() {
            const data = {
                page: window.location.pathname,
                referrer: document.referrer,
                utm_source: sessionStorage.getItem('utm_source') || '',
                utm_medium: sessionStorage.getItem('utm_medium') || '',
                utm_campaign: sessionStorage.getItem('utm_campaign') || ''
            };

            try {
                await fetch('/api/track', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
            } catch (e) {
                console.warn('Tracking offline');
            }
        }
    };

    tracking.init();
})();
