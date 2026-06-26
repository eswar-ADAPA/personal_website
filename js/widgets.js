// ============================================================
// WIDGETS — dashboard animations, AI chat
// ============================================================
// ===== Dashboard Animations =====
(function () {
    const dashSection = document.querySelector('.dashboard-strip');
    if (!dashSection) return;

    const donutFill = dashSection.querySelector('.donut-fill');
    const metricFill = dashSection.querySelector('.metric-bar-fill');
    let animated = false;

    const dashObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !animated) {
            animated = true;

            // Animate donut (220M out of ~250M max = ~88%)
            if (donutFill) {
                const circumference = 2 * Math.PI * 40; // ~251.3
                const offset = circumference * (1 - 0.88);
                donutFill.style.strokeDashoffset = offset;
            }

            // Animate metric bar (100 req/s out of ~120 = ~83%)
            if (metricFill) {
                metricFill.style.width = '83%';
            }

            // Animate line chart
            const dashLine = dashSection.querySelector('.dash-line');
            if (dashLine) {
                dashLine.style.animationPlayState = 'running';
            }
        }
    }, { threshold: 0.3 });

    dashObserver.observe(dashSection);
})();

// ===== C: AI Chat Widget =====
(function () {
    const toggle = document.getElementById('chatToggle');
    const window_ = document.getElementById('chatWindow');
    const close = document.getElementById('chatClose');
    const input = document.getElementById('chatInput');
    const send = document.getElementById('chatSend');
    const messages = document.getElementById('chatMessages');
    const suggestions = document.getElementById('chatSuggestions');

    if (!toggle || !window_) return;

    const toast = document.getElementById('chatToast');
    const toastClose = document.getElementById('chatToastClose');

    // Auto-show toast after 4 seconds
    setTimeout(() => {
        if (toast && !window_.classList.contains('open')) {
            toast.classList.add('show');
        }
    }, 4000);

    // Auto-hide toast after 12 seconds
    setTimeout(() => {
        if (toast) toast.classList.remove('show');
    }, 16000);

    // Click toast to open chat
    if (toast) {
        toast.addEventListener('click', (e) => {
            if (e.target === toastClose || e.target.closest('.chat-toast-close')) {
                toast.classList.remove('show');
                return;
            }
            toast.classList.remove('show');
            window_.classList.add('open');
            toggle.classList.add('opened');
        });
    }

    if (toastClose) {
        toastClose.addEventListener('click', (e) => {
            e.stopPropagation();
            toast.classList.remove('show');
        });
    }

    // Toggle chat
    toggle.addEventListener('click', () => {
        window_.classList.toggle('open');
        toggle.classList.add('opened');
        if (toast) toast.classList.remove('show');
    });

    close.addEventListener('click', () => {
        window_.classList.remove('open');
    });

    // Mode-aware knowledge bases: separate brain for each world
    const KB = {
        technical: {
            intro: "Hey! I'm Eswar's AI. Ask me about his technical work — ML, GenAI, Knowledge Graphs, or his projects!",
            suggestions: [
                ['What does Eswar do?', 'What does Eswar do?'],
                ['Multi-agent platform?', 'Tell me about the multi-agent platform'],
                ['Tech stack?', 'What is his tech stack?'],
                ['Contact?', 'How to contact Eswar?'],
            ],
            answers: {
                'what does eswar do': "Eswar is a Data Scientist / AI Engineer at Infinite Analytics (2+ yrs) — Big Data, ML, Knowledge Graphs & Agentic AI. He scaled real-world datasets to 220M+ records across 38 countries, built an 83M+ node knowledge graph, and deployed a multi-agent platform plus an in-house 1.5B LLM that power enterprise decision-making. (He's also a founder — switch to Startup mode up top!)",
                'multi-agent platform agent': "The multi-agent platform Eswar built and owns turns proprietary consumer, location & business data into actionable intelligence over hybrid Graph + Vector RAG — with an autonomous planner–executor agent orchestrating Trino, Neo4j & MCP servers. He also pre-trained an in-house 1.5B LLM that beats GPT-4o on domain tasks at sub-10ms p95, and built 22+ agent tools with LangSmith + Datadog observability (10x throughput, 31% lower token cost).",
                'tech stack': "Python, C, SQL, Cypher · LangGraph, LangChain, RAG / Graph RAG · DistilBERT & Transformers · PySpark, Apache Sedona, Iceberg, Airflow, Trino · FastAPI, Flask, RabbitMQ · Neo4j, MongoDB, Redis, MySQL, Qdrant, FAISS, ChromaDB · AWS (EC2/S3/EKS/SageMaker/Bedrock), Docker, K8s, Jenkins · Langfuse, Datadog, New Relic.",
                'contact email reach phone': "Email: eswaradapa90@gmail.com · Phone: +91 6309925636 · LinkedIn: eswar-adapa · GitHub: Eswar-09.",
                'default': "Great question! Eswar's a Data Scientist in ML, GenAI & Knowledge Graphs. Ask about his multi-agent platform, his tech stack, or how to reach him — or flip to Startup mode for his founder journey!"
            }
        },
        startup: {
            intro: "Hey! Ask me about Eswar's startup journey — Orbit (EV bike taxi), Quick Kirana, the prebiotic soda, or his biggest lessons!",
            suggestions: [
                ['What is Orbit?', 'What is Orbit?'],
                ['Quick Kirana?', 'Tell me about Quick Kirana'],
                ['Biggest lessons?', 'What are the biggest lessons?'],
                ['All ventures?', 'What ventures has he built?'],
            ],
            answers: {
                'orbit': "Orbit (Evigo) is Eswar's all-electric, asset-light bike-taxi platform for India. 3 live apps (rider, captain, admin) on a Spring Boot backend on Fly.io — KYC, SOS, audit logs, carbon ledger. Captains earn ~+38%/day, riders save ~30%, 0% commission under 3km. Live: orbit-bike-taxi.web.app.",
                'taxi bike': "That's Orbit — his all-electric bike-taxi venture, live in pre-launch with real pilot rides from BKC to the stations. Ask 'what is Orbit?' for the full picture!",
                'kirana': "Quick Kirana turned neighbourhood kirana shops into dark stores for fast grocery delivery. Eswar ran a real community pilot — 49 door-to-door interviews — but of 49 warm conversations, only 1 became an order. The lesson: interest is not intent.",
                'soda prebiotic': "His first venture: a healthy prebiotic soda for India (inspired by Olipop). He reached 30+ scientists and ran 2 taste-test batches, but the taste never landed and the market wasn't ready. Lesson: for a consumer product, the product itself is the strategy.",
                'lesson': "Eswar's hard-won lessons: tell people your idea early · interest ≠ intent (only orders count) · unit economics decide the game · frame for the customer's benefit · timing matters · know when to stop.",
                'venture startup journey': "3 ventures end-to-end: (1) a prebiotic soda, (2) Quick Kirana — a dark-kirana quick-commerce pilot, and (3) Orbit — an all-electric bike taxi that's live today. Explore the Ventures, Timeline and Deep Dives sections!",
                'people team built': "He built with friends & teammates: Naman Sharma, Anurag, Harish, Saketh & Gana Jayanth on Orbit; Samyak Bansal on Quick Kirana; Hemanth & Jayanth plus 30+ experts on the soda.",
                'contact email reach phone': "Email: eswaradapa90@gmail.com · Phone: +91 6309925636 · LinkedIn: eswar-adapa · GitHub: Eswar-09.",
                'default': "Eswar's built 3 ventures — a prebiotic soda, Quick Kirana, and Orbit (live EV bike taxi). Ask me about any of them, or his biggest lessons!"
            }
        }
    };

    let active = KB.technical;

    function findAnswer(query) {
        const q = query.toLowerCase().trim();
        for (const [key, val] of Object.entries(active.answers)) {
            if (key === 'default') continue;
            const kws = key.split(' ');
            const hits = kws.filter(kw => q.includes(kw));
            if (hits.length >= Math.ceil(kws.length * 0.5)) return val;
        }
        return active.answers['default'];
    }

    function buildSuggestions() {
        if (!suggestions) return;
        suggestions.style.display = '';
        suggestions.innerHTML = '';
        active.suggestions.forEach(([label, q]) => {
            const btn = document.createElement('button');
            btn.className = 'chat-suggestion';
            btn.textContent = label;
            btn.addEventListener('click', () => { input.value = q; handleSend(); });
            suggestions.appendChild(btn);
        });
    }

    function applyMode(mode) {
        active = (mode === 'startup') ? KB.startup : KB.technical;
        if (messages) messages.innerHTML = '<div class="chat-msg chat-bot"><p>' + active.intro + '</p></div>';
        buildSuggestions();
    }

    function addMessage(text, isUser) {
        const msg = document.createElement('div');
        msg.className = `chat-msg ${isUser ? 'chat-user' : 'chat-bot'}`;
        msg.innerHTML = `<p>${text.replace(/\n/g, '<br>')}</p>`;
        messages.appendChild(msg);
        messages.scrollTop = messages.scrollHeight;
    }

    function showTyping() {
        const typing = document.createElement('div');
        typing.className = 'chat-typing';
        typing.id = 'chatTypingIndicator';
        typing.innerHTML = '<span></span><span></span><span></span>';
        messages.appendChild(typing);
        messages.scrollTop = messages.scrollHeight;
    }

    function removeTyping() {
        const t = document.getElementById('chatTypingIndicator');
        if (t) t.remove();
    }

    function handleSend() {
        const q = input.value.trim();
        if (!q) return;

        addMessage(q, true);
        input.value = '';

        // Hide suggestions after first message
        if (suggestions) suggestions.style.display = 'none';

        showTyping();

        setTimeout(() => {
            removeTyping();
            addMessage(findAnswer(q), false);
        }, 800 + Math.random() * 600);
    }

    send.addEventListener('click', handleSend);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') handleSend();
    });

    // Mode-aware: rebuild brain + suggestions on world switch, and on load
    document.addEventListener('sitemodechange', (e) => applyMode(e.detail));
    applyMode(document.body.dataset.mode || 'technical');
})();

