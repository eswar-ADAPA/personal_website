// ============================================================
// EFFECTS — preloader, cursor, scroll progress, parallax, magnetic, reveal, image zoom, smooth scroll
// ============================================================
// ===== Preloader (name reveal + curtain) =====
(function () {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloaderFill');
    if (!preloader || !fill) return;

    document.body.classList.add('loading');

    function revealHero(stepDelay) {
        document.querySelectorAll('.split-word').forEach((word, i) => {
            setTimeout(() => word.classList.add('revealed'), stepDelay + i * 150);
        });
    }

    // Show the full intro only once per session — reloads are instant after that
    let seen = false;
    try { seen = sessionStorage.getItem('introSeen') === '1'; } catch (e) {}
    if (seen) {
        preloader.style.display = 'none';
        document.body.classList.remove('loading');
        revealHero(80);
        return;
    }
    try { sessionStorage.setItem('introSeen', '1'); } catch (e) {}

    const start = performance.now();
    const MIN_MS = 3700;            // let the slower name-reveal animation finish first
    let progress = 0;

    function finish() {
        preloader.classList.add('done');           // curtain lifts
        document.body.classList.remove('loading');
        revealHero(250);
    }

    const interval = setInterval(() => {
        progress = Math.min(progress + (Math.random() * 14 + 6), 100);
        fill.style.width = progress + '%';
        if (progress >= 100 && performance.now() - start >= MIN_MS) {
            clearInterval(interval);
            setTimeout(finish, 250);
        }
    }, 110);
})();

// ===== Custom Cursor =====
(function () {
    const cursor = document.getElementById('cursor');
    const follower = document.getElementById('cursorFollower');
    const cursorText = document.getElementById('cursorText');
    if (!cursor || !follower) return;

    // Check for touch device
    if ('ontouchstart' in window) return;

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
        followerX += (mouseX - followerX) * 0.12;
        followerY += (mouseY - followerY) * 0.12;
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';
        requestAnimationFrame(animateFollower);
    }
    animateFollower();

    // Hover effects on interactive elements
    const links = document.querySelectorAll('a, button, [data-magnetic]');
    links.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hovering');
            cursor.style.transform = 'translate(-50%, -50%) scale(0.5)';
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hovering');
            cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        });
    });

    // Card hover with "View" text
    const cards = document.querySelectorAll('.project-card, .publication-card, .achievement-card, .education-card');
    cards.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hovering-card');
            cursorText.textContent = 'View';
            cursor.style.opacity = '0';
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hovering-card');
            cursorText.textContent = '';
            cursor.style.opacity = '1';
        });
    });

    // Hide cursor when leaving window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        follower.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        follower.style.opacity = '1';
    });
})();

// ===== Scroll Progress Bar =====
(function () {
    const progressBar = document.getElementById('scrollProgress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        progressBar.style.width = progress + '%';
    }, { passive: true });
})();

// ===== Parallax Depth Layers =====
(function () {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    if (!parallaxElements.length) return;

    function updateParallax() {
        const scrollY = window.scrollY;
        parallaxElements.forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax'));
            const y = -(scrollY * speed);
            el.style.transform = `translateY(${y}px)`;
        });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
})();

// ===== Magnetic Cursor Effect =====
(function () {
    const magneticElements = document.querySelectorAll('[data-magnetic]');
    if (!magneticElements.length) return;

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * 0.25;
            const deltaY = (e.clientY - centerY) * 0.25;

            el.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // Also add magnetic effect to social links and contact cards
    document.querySelectorAll('.social-link, .contact-card, .skill-card').forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = (e.clientX - centerX) * 0.08;
            const deltaY = (e.clientY - centerY) * 0.08;

            el.style.transform = `translateY(-4px) translate(${deltaX}px, ${deltaY}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
})();

// ===== Scroll Animations (Intersection Observer) =====
(function () {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const delay = entry.target.getAttribute('data-delay') || 0;
                    setTimeout(() => {
                        entry.target.classList.add('visible');
                    }, parseInt(delay));
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    document.querySelectorAll('.fade-in, .stagger-in').forEach((el) => observer.observe(el));
})();

// ===== Image Zoom on Hover =====
(function () {
    const container = document.querySelector('.about-image-container');
    const img = document.querySelector('.about-image');
    if (!container || !img) return;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        img.style.transformOrigin = `${x}% ${y}%`;
    });

    container.addEventListener('mouseleave', () => {
        img.style.transformOrigin = 'center center';
    });
})();

// ===== Smooth scroll for anchor links =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

