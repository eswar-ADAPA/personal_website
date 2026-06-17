// ============================================================
// ACCESS GATE — three shareable links:
//   ?v=technical  (or /technical)  → Technical world only
//   ?v=startup    (or /startup)    → Startup world only
//   (no param)    (or /)           → Both worlds, with the toggle
// Runs BEFORE the other scripts so the hidden world's canvases /
// audio never initialise. NOTE: this is UI-level gating — for true
// hard separation you'd need separate builds or server auth.
// ============================================================
(function () {
    function resolve() {
        const q = new URLSearchParams(location.search);
        let v = (q.get('v') || q.get('view') || q.get('access') || '').toLowerCase();
        if (!v) {
            const path = location.pathname.toLowerCase();
            if (/startup|founder/.test(path)) v = 'startup';
            else if (/technical|\btech\b/.test(path)) v = 'technical';
        }
        if (v === 'tech' || v === 'technical') return 'technical';
        if (v === 'startup' || v === 'founder') return 'startup';
        return 'all';
    }

    const access = resolve();
    window.SITE_ACCESS = access;

    const body = document.body;
    if (access === 'technical' || access === 'startup') {
        body.dataset.mode = access;
        body.classList.add('locked', 'locked-' + access);

        // remove the other world entirely so it can't be reached or initialised
        const other = access === 'technical' ? 'startup' : 'technical';
        document.querySelectorAll('[data-world="' + other + '"]').forEach(n => n.remove());
    }
})();
