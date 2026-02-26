document.addEventListener('DOMContentLoaded', () => {
    initMarquees();
});

function initMarquees() {
    const tracks = document.querySelectorAll('.marquee-track');
    tracks.forEach(track => {
        // Clone contents for seamless loop
        const clone = track.innerHTML;
        track.innerHTML = clone + clone;

        const speed = track.getAttribute('data-speed') || 30;
        track.style.animationDuration = `${speed}s`;

        track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
        track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
    });
}
