// ============================================================
// HERO — neural canvas, typing, navbar, shrink box, counters, live terminal, 3D knowledge graph
// ============================================================
// ===== Neural Network Canvas Animation =====
(function () {
    const canvas = document.getElementById('neuralCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            if (mouse.x !== null) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const force = (150 - dist) / 150;
                    this.vx += (dx / dist) * force * 0.2;
                    this.vy += (dy / dist) * force * 0.2;
                }
            }

            this.vx *= 0.99;
            this.vy *= 0.99;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(224, 101, 32, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 8000), 150);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 160) {
                    const opacity = (1 - dist / 160) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(224, 101, 32, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        animationId = requestAnimationFrame(animate);
    }

    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    init();
    animate();

    window.addEventListener('resize', () => {
        cancelAnimationFrame(animationId);
        init();
        animate();
    });
})();

// ===== Typing Effect =====
(function () {
    const phrases = [
        'ML Engineer',
        'GenAI Builder',
        'Graph Systems',
        'Data Engineering',
        'NLP & Transformers',
        'Multi-Agent AI',
    ];

    const el = document.getElementById('typingText');
    if (!el) return;

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function type() {
        const current = phrases[phraseIndex];

        if (isDeleting) {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
        } else {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
        }

        let delay = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === current.length) {
            delay = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            delay = 400;
        }

        setTimeout(type, delay);
    }

    type();
})();

// ===== Navbar Scroll =====
(function () {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('.section');

    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);

        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 150;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    const toggle = document.getElementById('navToggle');
    const navLinksContainer = document.getElementById('navLinks');

    if (toggle) {
        toggle.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        navLinksContainer.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinksContainer.classList.remove('active');
            });
        });
    }
})();

// ===== Shrinking Box Effect =====
(function () {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;

    function updateShrink() {
        const mode = document.body.dataset.mode || 'technical';
        const hero = document.querySelector('.hero[data-world="' + mode + '"]') || document.getElementById('hero');
        if (!hero) return;
        const heroBottom = hero.offsetTop + hero.offsetHeight;
        if (heroBottom <= 0) return;
        const scrolled = window.scrollY;
        // Start effect when hero is partially scrolled
        const progress = Math.min(Math.max((scrolled - heroBottom * 0.3) / (heroBottom * 0.7), 0), 1);

        // Width from 100% to 96%, border-radius from 0 to 24px
        const widthPercent = 100 - (progress * 4);
        const radius = progress * 24;

        mainContent.style.width = widthPercent + '%';
        mainContent.style.margin = '0 auto';
        mainContent.style.borderRadius = `${radius}px`;
    }

    window.addEventListener('scroll', updateShrink, { passive: true });
    updateShrink();
})();

// ===== Counter Animation =====
(function () {
    const counters = document.querySelectorAll('.stat-number');
    let started = false;

    function animateCounters() {
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000;
            const start = performance.now();

            function update(now) {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const ease = 1 - Math.pow(1 - progress, 3);
                counter.textContent = Math.floor(target * ease);

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = target;
                }
            }

            requestAnimationFrame(update);
        });
    }

    const statsObserver = new IntersectionObserver(
        (entries) => {
            if (entries[0].isIntersecting && !started) {
                started = true;
                animateCounters();
            }
        },
        { threshold: 0.5 }
    );

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) statsObserver.observe(statsSection);
})();

// ===== Live Code Terminal =====
(function () {
    const codeEl = document.getElementById('terminalCode');
    if (!codeEl) return;

    const snippets = [
        [
            { text: '# Building Multi-Agent AI System', cls: 'tk-comment' },
            { text: 'from', cls: 'tk-keyword' }, { text: ' langgraph.graph ', cls: 'tk-var' }, { text: 'import', cls: 'tk-keyword' }, { text: ' StateGraph', cls: 'tk-class' },
            { text: 'from', cls: 'tk-keyword' }, { text: ' langchain ', cls: 'tk-var' }, { text: 'import', cls: 'tk-keyword' }, { text: ' ChatOpenAI', cls: 'tk-class' },
            { text: '' },
            { text: 'graph = StateGraph(', cls: 'tk-var', end: '' }, { text: 'AgentState', cls: 'tk-class', end: ')' },
            { text: 'graph.', cls: 'tk-var', end: '' }, { text: 'add_node', cls: 'tk-method', end: '(' }, { text: '"search"', cls: 'tk-string', end: ', search_agent)' },
            { text: 'graph.', cls: 'tk-var', end: '' }, { text: 'add_node', cls: 'tk-method', end: '(' }, { text: '"analyze"', cls: 'tk-string', end: ', analyst_agent)' },
            { text: 'graph.', cls: 'tk-var', end: '' }, { text: 'add_edge', cls: 'tk-method', end: '(' }, { text: '"search"', cls: 'tk-string', end: ', ' }, { text: '"analyze"', cls: 'tk-string', end: ')' },
            { text: 'app = graph.', cls: 'tk-var', end: '' }, { text: 'compile', cls: 'tk-method', end: '()  ' }, { text: '# 10x throughput', cls: 'tk-comment' },
        ],
        [
            { text: '# POI Knowledge Graph Pipeline', cls: 'tk-comment' },
            { text: 'from', cls: 'tk-keyword' }, { text: ' neo4j ', cls: 'tk-var' }, { text: 'import', cls: 'tk-keyword' }, { text: ' GraphDatabase', cls: 'tk-class' },
            { text: 'from', cls: 'tk-keyword' }, { text: ' pyspark.sql ', cls: 'tk-var' }, { text: 'import', cls: 'tk-keyword' }, { text: ' SparkSession', cls: 'tk-class' },
            { text: '' },
            { text: 'spark = SparkSession.builder.', cls: 'tk-var', end: '' }, { text: 'getOrCreate', cls: 'tk-method', end: '()' },
            { text: 'pois = spark.read.', cls: 'tk-var', end: '' }, { text: 'parquet', cls: 'tk-method', end: '(' }, { text: '"s3://poi-data/"', cls: 'tk-string', end: ')' },
            { text: '# 220M POIs across 38 countries', cls: 'tk-comment' },
            { text: 'embeddings = ', cls: 'tk-var', end: '' }, { text: 'GraphSAGE', cls: 'tk-class', end: '(' }, { text: 'pois', cls: 'tk-var', end: ', dims=' }, { text: '128', cls: 'tk-number', end: ')' },
            { text: 'graph.run(', cls: 'tk-var', end: '' }, { text: '"gds.knn.write"', cls: 'tk-string', end: ', top_k=' }, { text: '10', cls: 'tk-number', end: ')' },
        ],
        [
            { text: '# RAG Pipeline with Multi-Layer Retrieval', cls: 'tk-comment' },
            { text: 'from', cls: 'tk-keyword' }, { text: ' qdrant_client ', cls: 'tk-var' }, { text: 'import', cls: 'tk-keyword' }, { text: ' QdrantClient', cls: 'tk-class' },
            { text: 'import', cls: 'tk-keyword' }, { text: ' faiss', cls: 'tk-var' },
            { text: '' },
            { text: 'schema_store = ', cls: 'tk-var', end: '' }, { text: 'QdrantClient', cls: 'tk-class', end: '(url=' }, { text: '"localhost:6333"', cls: 'tk-string', end: ')' },
            { text: 'brand_index = faiss.', cls: 'tk-var', end: '' }, { text: 'IndexFlatIP', cls: 'tk-method', end: '(' }, { text: '768', cls: 'tk-number', end: ')' },
            { text: '' },
            { text: 'def', cls: 'tk-keyword' }, { text: ' retrieve', cls: 'tk-func', end: '(query):' },
            { text: '    schema = schema_store.', cls: 'tk-var', end: '' }, { text: 'search', cls: 'tk-method', end: '(query)' },
            { text: '    brands = brand_index.', cls: 'tk-var', end: '' }, { text: 'search', cls: 'tk-method', end: '(query, k=' }, { text: '5', cls: 'tk-number', end: ')' },
            { text: '    ', cls: 'tk-var', end: '' }, { text: 'return', cls: 'tk-keyword' }, { text: ' merge_context(schema, brands)', cls: 'tk-var' },
        ],
    ];

    let snippetIndex = 0;

    function renderSnippet(snippet) {
        codeEl.innerHTML = '';
        let lines = [];
        let currentLine = [];

        snippet.forEach(token => {
            if (token.text === '') {
                if (currentLine.length > 0) lines.push(currentLine);
                lines.push([]);
                currentLine = [];
                return;
            }

            // Check if this starts a new line (starts with keyword like from/import/def/# or variable at line start)
            const isNewLine = token.cls === 'tk-comment' ||
                (token.cls === 'tk-keyword' && (token.text === 'from' || token.text === 'import' || token.text === 'def')) ||
                (token.text.match(/^[a-z]/) && !token.text.startsWith(' ') && currentLine.length === 0);

            if (isNewLine && currentLine.length > 0 && token.cls !== 'tk-keyword') {
                lines.push(currentLine);
                currentLine = [];
            }

            currentLine.push(token);

            // If token.text starts with from/def/# push after adding
            if (token.cls === 'tk-comment' || (token.end !== undefined && currentLine.length > 0)) {
                // continue on same line
            }
        });
        if (currentLine.length > 0) lines.push(currentLine);

        // Build HTML line by line
        let html = '';
        snippet.forEach(token => {
            if (token.text === '') {
                html += '\n';
                return;
            }
            const end = token.end !== undefined ? token.end : '';
            html += `<span class="${token.cls || ''}">${token.text}</span>${end}`;

            // Add newline after comments or if there's no end connector
            if (token.cls === 'tk-comment' ||
                (token.end !== undefined && token.end.endsWith(')')) ||
                (token.cls === 'tk-class' && token.end === undefined)) {
                html += '\n';
            }
        });

        return html;
    }

    function typeSnippet() {
        const snippet = snippets[snippetIndex];
        const fullHTML = renderSnippet(snippet);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullHTML;
        const fullText = tempDiv.textContent;

        let charIdx = 0;
        codeEl.innerHTML = '';

        function typeChar() {
            if (charIdx <= fullText.length) {
                // Build partial HTML up to charIdx characters
                let count = 0;
                let partialHTML = '';
                let i = 0;
                while (i < fullHTML.length && count < charIdx) {
                    if (fullHTML[i] === '<') {
                        const closeIdx = fullHTML.indexOf('>', i);
                        partialHTML += fullHTML.substring(i, closeIdx + 1);
                        i = closeIdx + 1;
                    } else {
                        partialHTML += fullHTML[i];
                        count++;
                        i++;
                    }
                }
                // Close any remaining open tags
                const openTags = partialHTML.match(/<span[^>]*>/g) || [];
                const closeTags = partialHTML.match(/<\/span>/g) || [];
                const unclosed = openTags.length - closeTags.length;
                for (let t = 0; t < unclosed; t++) partialHTML += '</span>';

                codeEl.innerHTML = partialHTML + '<span class="tk-cursor"></span>';
                charIdx++;
                setTimeout(typeChar, 25 + Math.random() * 20);
            } else {
                // Wait then move to next snippet
                setTimeout(() => {
                    snippetIndex = (snippetIndex + 1) % snippets.length;
                    typeSnippet();
                }, 4000);
            }
        }

        typeChar();
    }

    // Start after preloader
    setTimeout(typeSnippet, 2500);
})();

// ===== B: 3D Knowledge Graph =====
(function () {
    const canvas = document.getElementById('knowledgeGraph3D');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let rotX = 0.3, rotY = 0.5;
    let autoRotY = 0;
    let isDragging = false;
    let lastMouse = { x: 0, y: 0 };

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    // Generate nodes in 3D space
    const labels = [
        'POI', 'User', 'Brand', 'Review', 'Location',
        'Segment', 'Behavior', 'Visit', 'Category', 'Region',
        'Score', 'H3Index', 'Embedding', 'Agent', 'Query'
    ];

    const nodes = labels.map((label, i) => ({
        label,
        x: (Math.random() - 0.5) * 300,
        y: (Math.random() - 0.5) * 300,
        z: (Math.random() - 0.5) * 300,
        r: Math.random() * 4 + 3,
    }));

    // Generate edges (connect nearby nodes)
    const edges = [];
    for (let i = 0; i < nodes.length; i++) {
        const connections = Math.floor(Math.random() * 3) + 1;
        for (let c = 0; c < connections; c++) {
            const j = (i + Math.floor(Math.random() * 5) + 1) % nodes.length;
            if (i !== j) edges.push([i, j]);
        }
    }

    function project(node) {
        // Rotate Y
        const cosY = Math.cos(rotY + autoRotY);
        const sinY = Math.sin(rotY + autoRotY);
        let x = node.x * cosY - node.z * sinY;
        let z = node.x * sinY + node.z * cosY;

        // Rotate X
        const cosX = Math.cos(rotX);
        const sinX = Math.sin(rotX);
        let y = node.y * cosX - z * sinX;
        z = node.y * sinX + z * cosX;

        // Perspective projection
        const fov = 600;
        const scale = fov / (fov + z + 400);
        return {
            x: x * scale + width / 2,
            y: y * scale + height / 2,
            scale,
            z
        };
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        if (!isDragging) {
            autoRotY += 0.003;
        }

        // Draw edges
        edges.forEach(([i, j]) => {
            const a = project(nodes[i]);
            const b = project(nodes[j]);
            const avgScale = (a.scale + b.scale) / 2;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(224, 101, 32, ${0.08 * avgScale})`;
            ctx.lineWidth = avgScale * 1.2;
            ctx.stroke();
        });

        // Sort nodes by z for proper layering
        const sorted = nodes.map((n, i) => ({ ...n, i, ...project(n) }))
            .sort((a, b) => a.z - b.z);

        // Draw nodes
        sorted.forEach(n => {
            // Glow
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * n.scale * 3, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 121, 34, ${0.04 * n.scale})`;
            ctx.fill();

            // Node
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * n.scale, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(224, 101, 32, ${0.25 + n.scale * 0.4})`;
            ctx.fill();

            // Ring
            ctx.beginPath();
            ctx.arc(n.x, n.y, n.r * n.scale + 2, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(224, 101, 32, ${0.1 * n.scale})`;
            ctx.lineWidth = 1;
            ctx.stroke();

            // Label
            if (n.scale > 0.5) {
                ctx.font = `${Math.max(9, 11 * n.scale)}px "JetBrains Mono", monospace`;
                ctx.fillStyle = `rgba(17, 17, 17, ${0.15 + n.scale * 0.2})`;
                ctx.textAlign = 'center';
                ctx.fillText(n.label, n.x, n.y - n.r * n.scale - 6);
            }
        });

        requestAnimationFrame(draw);
    }

    // Mouse drag to rotate
    canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        lastMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const dx = e.clientX - lastMouse.x;
        const dy = e.clientY - lastMouse.y;
        rotY += dx * 0.005;
        rotX += dy * 0.005;
        lastMouse = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => { isDragging = false; });

    // Touch support
    canvas.addEventListener('touchstart', (e) => {
        isDragging = true;
        lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    canvas.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const dx = e.touches[0].clientX - lastMouse.x;
        const dy = e.touches[0].clientY - lastMouse.y;
        rotY += dx * 0.005;
        rotX += dy * 0.005;
        lastMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    });

    canvas.addEventListener('touchend', () => { isDragging = false; });

    draw();
})();

