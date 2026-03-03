function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

const SETTINGS = {
    domParticles: {
        densityDivisor: 1.618,
        minCount: 1,
        maxCount: 16,
        maxNegativeDelaySeconds: 20
    },
    nebula: {
        cloudCount: 16,
        radiusMin: 50,
        radiusMax: 50 * 10 * 1.618,
        depthMin: 0.2,
        depthMax: 1.0,
        driftXMin: -0.08,
        driftXMax: 0.08,
        driftYMin: -0.06,
        driftYMax: 0.06,
        oscillationX: 24,
        oscillationY: 18,
        driftTimeFactor: 0.01618
    },
    constellation: {
        densityDivisor: 10 * 1.618,
        minCount: 42,
        maxCount: 42 * 1.618,
        speedXMin: -0.000018,
        speedXMax: 0.000018,
        speedYMin: -0.000015,
        speedYMax: 0.000015,
        depthMin: 0.25,
        depthMax: 1.0,
        sizeMin: 0.8,
        sizeMax: 3.2,
        wrapMargin: 0.05,
        linkDistance: 162,
        linkBaseAlpha: 0.50,
        dotBaseAlpha: 0.24,
        dotDepthAlpha: 0.42,
        lineBaseWidth: 0.9,
        lineDepthWidth: 0.35
    },
    canvas: {
        maxDpr: 2
    }
};

function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
}

function createLayerCanvas(className) {
    const canvas = document.createElement("canvas");
    canvas.className = `bg-layer ${className}`;
    return canvas;
}

function generateBackgroundParticles() {
    const container = document.getElementById("particles");
    if (!container || container.dataset.initialized === "true") return;

    container.dataset.initialized = "true";

    const particleCount = clamp(
        Math.floor(window.innerWidth / SETTINGS.domParticles.densityDivisor),
        SETTINGS.domParticles.minCount,
        SETTINGS.domParticles.maxCount
    );

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement("div");
        particle.className = "particle";

        if (Math.random() < 0.5) {
            particle.style.left = `${Math.random() * 30}vw`;
        } else {
            particle.style.left = `${70 + Math.random() * 30}vw`;
        }

        particle.style.top = `${Math.random() * 100}vh`;
        particle.style.animationDelay = `${-Math.random() * SETTINGS.domParticles.maxNegativeDelaySeconds}s`;
        container.appendChild(particle);
    }
}

function setCanvasSize(canvases, context) {
    const { innerWidth, innerHeight, devicePixelRatio } = window;
    const dpr = clamp(devicePixelRatio || 1, 1, SETTINGS.canvas.maxDpr);

    for (const canvas of canvases) {
        canvas.width = Math.floor(innerWidth * dpr);
        canvas.height = Math.floor(innerHeight * dpr);
        canvas.style.width = `${innerWidth}px`;
        canvas.style.height = `${innerHeight}px`;
    }

    context.setTransform(dpr, 0, 0, dpr, 0, 0);
}

function generateNebula(scene) {
    const nebulaCanvas = createLayerCanvas("nebula-layer");
    scene.appendChild(nebulaCanvas);
    const nebulaContext = nebulaCanvas.getContext("2d", { alpha: true });
    if (!nebulaContext) return;

    const colors = [
        "rgba(79, 172, 254, 0.55)",
        "rgba(0, 242, 254, 0.4)",
        "rgba(255, 107, 203, 0.34)"
    ];

    const nebulaClouds = Array.from({ length: SETTINGS.nebula.cloudCount }, () => ({
        x: Math.random(),
        y: Math.random(),
        radius: randomBetween(SETTINGS.nebula.radiusMin, SETTINGS.nebula.radiusMax),
        depth: randomBetween(SETTINGS.nebula.depthMin, SETTINGS.nebula.depthMax),
        driftX: randomBetween(SETTINGS.nebula.driftXMin, SETTINGS.nebula.driftXMax),
        driftY: randomBetween(SETTINGS.nebula.driftYMin, SETTINGS.nebula.driftYMax),
        phase: randomBetween(0, Math.PI * 2),
        color: colors[Math.floor(Math.random() * colors.length)]
    }));

    setCanvasSize([nebulaCanvas], nebulaContext);

    const draw = (time) => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        nebulaContext.clearRect(0, 0, width, height);
        nebulaContext.globalCompositeOperation = "lighter";

        for (const cloud of nebulaClouds) {
            const oscillation = Math.sin(time * 0.00008 + cloud.phase);
            const centerX =
                cloud.x * width +
                oscillation * SETTINGS.nebula.oscillationX +
                cloud.driftX * time * SETTINGS.nebula.driftTimeFactor;
            const centerY =
                cloud.y * height +
                Math.cos(time * 0.00006 + cloud.phase) * SETTINGS.nebula.oscillationY +
                cloud.driftY * time * SETTINGS.nebula.driftTimeFactor;

            const gradient = nebulaContext.createRadialGradient(
                centerX,
                centerY,
                0,
                centerX,
                centerY,
                cloud.radius
            );

            gradient.addColorStop(0, cloud.color);
            gradient.addColorStop(0.58, "rgba(20, 60, 110, 0.16)");
            gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

            nebulaContext.fillStyle = gradient;
            nebulaContext.beginPath();
            nebulaContext.arc(centerX, centerY, cloud.radius, 0, Math.PI * 2);
            nebulaContext.fill();
        }

        nebulaContext.globalCompositeOperation = "source-over";
    };

    const resize = () => {
        setCanvasSize([nebulaCanvas], nebulaContext);
    };

    return { draw, resize };
}

function generateConstellation(scene) {
    const constellationCanvas = createLayerCanvas("constellation-layer");
    scene.appendChild(constellationCanvas);
    const constellationContext = constellationCanvas.getContext("2d", { alpha: true });
    if (!constellationContext) return;

    const particleCount = clamp(
        Math.floor(window.innerWidth / SETTINGS.constellation.densityDivisor),
        SETTINGS.constellation.minCount,
        SETTINGS.constellation.maxCount
    );

    const particles = Array.from({ length: particleCount }, () => ({
        x: Math.random(),
        y: Math.random(),
        vx: randomBetween(SETTINGS.constellation.speedXMin, SETTINGS.constellation.speedXMax),
        vy: randomBetween(SETTINGS.constellation.speedYMin, SETTINGS.constellation.speedYMax),
        depth: randomBetween(SETTINGS.constellation.depthMin, SETTINGS.constellation.depthMax),
        size: randomBetween(SETTINGS.constellation.sizeMin, SETTINGS.constellation.sizeMax)
    }));

    setCanvasSize([constellationCanvas], constellationContext);

    const draw = () => {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const positions = [];

        constellationContext.clearRect(0, 0, width, height);

        for (const particle of particles) {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < -SETTINGS.constellation.wrapMargin) particle.x = 1 + SETTINGS.constellation.wrapMargin;
            if (particle.x > 1 + SETTINGS.constellation.wrapMargin) particle.x = -SETTINGS.constellation.wrapMargin;
            if (particle.y < -SETTINGS.constellation.wrapMargin) particle.y = 1 + SETTINGS.constellation.wrapMargin;
            if (particle.y > 1 + SETTINGS.constellation.wrapMargin) particle.y = -SETTINGS.constellation.wrapMargin;

            const drawX = particle.x * width;
            const drawY = particle.y * height;
            positions.push({ x: drawX, y: drawY, depth: particle.depth, size: particle.size });

            constellationContext.beginPath();
            constellationContext.fillStyle = `rgba(180, 240, 255, ${SETTINGS.constellation.dotBaseAlpha + particle.depth * SETTINGS.constellation.dotDepthAlpha})`;
            constellationContext.arc(drawX, drawY, particle.size, 0, Math.PI * 2);
            constellationContext.fill();
        }

        const maxDistance = SETTINGS.constellation.linkDistance;
        const speedBoost = 1;

        for (let i = 0; i < positions.length; i++) {
            const from = positions[i];

            for (let j = i + 1; j < positions.length; j++) {
                const to = positions[j];
                const distance = Math.hypot(from.x - to.x, from.y - to.y);
                if (distance > maxDistance) continue;

                const alpha = (1 - distance / maxDistance) * SETTINGS.constellation.linkBaseAlpha * speedBoost;
                constellationContext.strokeStyle = `rgba(118, 230, 255, ${alpha.toFixed(3)})`;
                constellationContext.lineWidth = SETTINGS.constellation.lineBaseWidth + (from.depth + to.depth) * SETTINGS.constellation.lineDepthWidth;
                constellationContext.beginPath();
                constellationContext.moveTo(from.x, from.y);
                constellationContext.lineTo(to.x, to.y);
                constellationContext.stroke();
            }
        }
    };

    const resize = () => {
        setCanvasSize([constellationCanvas], constellationContext);
    };

    return { draw, resize };
}

function initBackground() {
    const scene = document.querySelector(".scene");
    if (!scene || scene.dataset.initialized === "true") return;
    scene.dataset.initialized = "true";

    generateBackgroundParticles();
    const nebulaLayer = generateNebula(scene);
    const constellationLayer = generateConstellation(scene);

    if (!nebulaLayer || !constellationLayer) return;

    const animate = (time) => {
        nebulaLayer.draw(time);
        constellationLayer.draw();
        window.requestAnimationFrame(animate);
    };

    window.addEventListener(
        "resize",
        () => {
            nebulaLayer.resize();
            constellationLayer.resize();
        },
        { passive: true }
    );
    window.requestAnimationFrame(animate);
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackground);
} else {
    initBackground();
}