function generateBackgroundParticles() {
    const PARTICLE_COUNT = 1000;
    const container = document.getElementById('particles');

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.top = Math.random() * 100 + 'vh';
        p.style.animationDelay = (-Math.random() * 20) + 's';
        container.appendChild(p);
    }
}

generateBackgroundParticles();