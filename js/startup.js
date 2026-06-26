// ============================================================
// STARTUP — dual-world toggle, startup hero/canvas/typing, dashboards, MP3 audiobook player
// ============================================================
// ============================================================
// =================  STARTUP / DUAL-WORLD MODE  ==============
// ============================================================
(function () {
    const body = document.body;
    const slider = document.getElementById('modeSlider');
    const buttons = document.querySelectorAll('.mode-btn');
    if (!buttons.length) return;

    // ---- generic count-up ----
    function countUp(el) {
        const target = parseInt(el.getAttribute('data-target')) || 0;
        const duration = 1800;
        const start = performance.now();
        function step(now) {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(target * ease);
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target;
        }
        requestAnimationFrame(step);
    }
    function animateStartupStats() {
        document.querySelectorAll('#startupHero .sstat-number').forEach(countUp);
    }

    // ---- re-trigger hero headline reveal ----
    function revealStartupHeadline() {
        const words = document.querySelectorAll('#startupHeroName .split-word');
        words.forEach(w => w.classList.remove('revealed'));
        // force reflow
        void document.getElementById('startupHero').offsetWidth;
        words.forEach((w, i) => setTimeout(() => w.classList.add('revealed'), 120 + i * 120));
    }

    // ---- reveal all fade-ins for a given world ----
    function revealWorld(mode) {
        document.querySelectorAll('[data-world="' + mode + '"] .fade-in, [data-world="' + mode + '"] .stagger-in')
            .forEach(el => el.classList.add('visible'));
    }

    // ---- apply a mode ----
    function setMode(mode, userInitiated) {
        body.dataset.mode = mode;
        document.dispatchEvent(new CustomEvent('sitemodechange', { detail: mode }));
        buttons.forEach(b => b.classList.toggle('active', b.dataset.mode === mode));
        if (!body.classList.contains('locked')) { try { localStorage.setItem('siteMode', mode); } catch (e) {} }

        revealWorld(mode);

        if (mode === 'startup') {
            animateStartupStats();
            revealStartupHeadline();
        }

        if (userInitiated) {
            body.classList.add('mode-switching');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => body.classList.remove('mode-switching'), 600);
        }
    }

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            if (body.classList.contains('locked')) return;   // single-world access link
            const mode = btn.dataset.mode;
            if (mode === body.dataset.mode) return;
            setMode(mode, true);
            // update hash without jumping
            history.replaceState(null, '', mode === 'startup' ? '#startup' : ' ');
        });
    });

    // ---- initial mode (access-gate > hash > technical default) ----
    // A fresh visit always lands on Technical world; only an explicit
    // locked link or #startup hash opens Startup first.
    const access = window.SITE_ACCESS || 'all';
    let initial = 'technical';
    if (access === 'technical' || access === 'startup') {
        initial = access;                                    // locked link forces this world
    } else if (location.hash.toLowerCase() === '#startup') {
        initial = 'startup';
    }
    // set without smooth-scroll/animation flair on first paint
    setMode(initial, false);

    // ---- Startup hero canvas (rising indigo bubbles) ----
    (function () {
        const canvas = document.getElementById('ventureCanvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let bubbles = [];
        let raf;
        function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
        resize();
        window.addEventListener('resize', resize);

        function make() {
            return {
                x: Math.random() * canvas.width,
                y: canvas.height + Math.random() * canvas.height,
                r: Math.random() * 3 + 1,
                speed: Math.random() * 0.5 + 0.2,
                drift: (Math.random() - 0.5) * 0.3,
                op: Math.random() * 0.4 + 0.15
            };
        }
        function init() {
            const count = Math.min(Math.floor(canvas.width / 18), 90);
            bubbles = Array.from({ length: count }, make);
        }
        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < bubbles.length; i++) {
                const b = bubbles[i];
                b.y -= b.speed;
                b.x += b.drift;
                if (b.y < -10) Object.assign(b, make(), { y: canvas.height + 10 });
                ctx.beginPath();
                ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(99, 102, 241, ' + b.op + ')';
                ctx.fill();
            }
            // light connecting lines for a "network" feel
            for (let i = 0; i < bubbles.length; i++) {
                for (let j = i + 1; j < bubbles.length; j++) {
                    const dx = bubbles[i].x - bubbles[j].x;
                    const dy = bubbles[i].y - bubbles[j].y;
                    const d = Math.sqrt(dx * dx + dy * dy);
                    if (d < 120) {
                        ctx.beginPath();
                        ctx.moveTo(bubbles[i].x, bubbles[i].y);
                        ctx.lineTo(bubbles[j].x, bubbles[j].y);
                        ctx.strokeStyle = 'rgba(139, 92, 246, ' + (1 - d / 120) * 0.10 + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        }
        init();
        draw();
        window.addEventListener('resize', () => { cancelAnimationFrame(raf); init(); draw(); });
    })();

    // ---- Startup hero typing effect ----
    (function () {
        const el = document.getElementById('startupTypingText');
        if (!el) return;
        const phrases = ['Prebiotic Soda', 'Quick Commerce', 'Bike Taxi', 'Field Research', '0 → 1 Builder', 'Unit Economics'];
        let pi = 0, ci = 0, deleting = false;
        function type() {
            const cur = phrases[pi];
            el.textContent = deleting ? cur.substring(0, ci - 1) : cur.substring(0, ci + 1);
            ci += deleting ? -1 : 1;
            let delay = deleting ? 40 : 85;
            if (!deleting && ci === cur.length) { delay = 1800; deleting = true; }
            else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 400; }
            setTimeout(type, delay);
        }
        type();
    })();

    // ---- Startup dashboards: animate each on scroll into view ----
    (function () {
        const dashes = document.querySelectorAll('.startup-dash');
        if (!dashes.length) return;
        const circ = 2 * Math.PI * 40; // donut circumference ≈ 251.3

        function animateDash(dash) {
            if (dash.dataset.animated) return;
            dash.dataset.animated = '1';
            dash.classList.add('animate'); // funnel bars via CSS

            dash.querySelectorAll('.s-donut').forEach(d => {
                const pct = parseFloat(d.getAttribute('data-pct')) || 0;
                d.style.strokeDashoffset = circ * (1 - pct);
            });
            dash.querySelectorAll('.s-metric-fill').forEach(m => {
                m.style.width = (parseFloat(m.getAttribute('data-w')) || 0) + '%';
            });
            dash.querySelectorAll('.bar').forEach(bar => {
                const target = bar.style.getPropertyValue('--bar-height');
                bar.style.height = '0';
                void bar.offsetWidth;
                bar.style.height = target;
            });
        }

        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => { if (e.isIntersecting) { animateDash(e.target); obs.unobserve(e.target); } });
        }, { threshold: 0.25 });
        dashes.forEach(d => obs.observe(d));
    })();
})();

// ============================================================
// ===========  AUDIOBOOK — waveform story player  ===========
// ============================================================
(function () {
    const players = document.querySelectorAll('.audio-player');
    if (!players.length) return;

    const SPEEDS = [1, 1.25, 1.5, 2];
    let rate = 1;          // shared playback speed
    let current = null;    // currently-playing <audio>

    // fixed pseudo-waveform pattern (deterministic, looks organic)
    const PATTERN = [30,48,62,40,72,55,88,66,44,78,58,95,70,50,82,60,38,68,90,52,
                     74,46,86,64,42,76,56,92,68,48,80,58,36,66,84,54,72,44,88,62];
    const BARS = PATTERN.length;

    players.forEach(p => {
        const audio = p.querySelector('audio');
        const playBtn = p.querySelector('.ap-play');
        const playIcon = playBtn.querySelector('i');
        const wave = p.querySelector('.ap-wave');
        const speedBtn = p.querySelector('.ap-speed');

        // build the waveform bars
        const bars = [];
        for (let i = 0; i < BARS; i++) {
            const b = document.createElement('span');
            b.className = 'wv';
            b.style.setProperty('--h', PATTERN[i] + '%');
            b.style.animationDelay = (i * 0.03) + 's';
            wave.appendChild(b);
            bars.push(b);
        }

        function setPlayingUI(on) {
            p.classList.toggle('playing', on);
            playIcon.className = on ? 'fas fa-pause' : 'fas fa-play';
        }
        function paint() {
            const dur = audio.duration || 0;
            const filled = dur ? Math.round((audio.currentTime / dur) * BARS) : 0;
            for (let i = 0; i < BARS; i++) bars[i].classList.toggle('played', i < filled);
        }

        audio.addEventListener('timeupdate', paint);
        audio.addEventListener('play', () => setPlayingUI(true));
        audio.addEventListener('pause', () => setPlayingUI(false));
        audio.addEventListener('ended', () => { setPlayingUI(false); paint(); if (current === audio) current = null; });

        playBtn.addEventListener('click', () => {
            if (audio.paused) {
                if (current && current !== audio) current.pause();
                audio.playbackRate = rate;
                current = audio;
                const pr = audio.play();
                if (pr && pr.catch) pr.catch(() => {});
            } else {
                audio.pause();
            }
        });

        // click the waveform to seek
        wave.addEventListener('click', (e) => {
            const r = wave.getBoundingClientRect();
            const ratio = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
            if (audio.duration) { audio.currentTime = ratio * audio.duration; paint(); }
        });

        // speed cycles 1x -> 1.25x -> 1.5x -> 2x (applies to all players)
        speedBtn.addEventListener('click', () => {
            rate = SPEEDS[(SPEEDS.indexOf(rate) + 1) % SPEEDS.length];
            document.querySelectorAll('.ap-speed').forEach(b => b.textContent = rate + '×');
            if (current) current.playbackRate = rate;
        });
    });

    // pause narration when switching worlds
    document.querySelectorAll('.mode-btn').forEach(b => b.addEventListener('click', () => { if (current) current.pause(); }));
})();


// ============================================================
// Make whole venture cards clickable -> their deep dive
// ============================================================
(function () {
    document.querySelectorAll('.venture-card').forEach(card => {
        const link = card.querySelector('.venture-link[href^="#"]');
        if (!link) return;
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            if (e.target.closest('a')) return;            // let real links behave
            const target = document.querySelector(link.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();
