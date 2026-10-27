const revealItems = document.querySelectorAll('.reveal');
let reducedMotion = true;

try {
    if (typeof window.matchMedia === 'function') {
        reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
} catch {
    // Keep the page static if motion preferences cannot be determined.
}

if (!reducedMotion && typeof window.IntersectionObserver === 'function') {
    let revealObserver;

    try {
        revealObserver = new window.IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        revealItems.forEach((item) => revealObserver.observe(item));
    } catch {
        if (revealObserver) revealObserver.disconnect();
        // Reveal animations are optional; the base styles keep content visible.
    }
}

const aboutSection = document.querySelector('.about-section');
const aboutCube = document.querySelector('.cube');

if (aboutSection && aboutCube && !reducedMotion && typeof window.requestAnimationFrame === 'function') {
    let cubeScrollFrame;

    const rotateCubeWithScroll = () => {
        const sectionTop = aboutSection.getBoundingClientRect().top + window.scrollY;
        const rotation = (window.scrollY - sectionTop) * 0.22;
        aboutCube.style.transform = `rotateX(-18deg) rotateY(${rotation - 28}deg) rotateZ(${rotation + 6}deg)`;
        cubeScrollFrame = undefined;
    };

    window.addEventListener('scroll', () => {
        if (cubeScrollFrame !== undefined) return;
        cubeScrollFrame = window.requestAnimationFrame(rotateCubeWithScroll);
    }, { passive: true });

    rotateCubeWithScroll();
}
