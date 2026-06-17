# Architecture & Features

Everything this site does and how it's built. Companion to
[README.md](README.md) (quick start) and [DEPLOYMENT.md](DEPLOYMENT.md) (hosting).

The site is a **single static page** (`index.html`) with no build step or
framework — just modular HTML, CSS, and vanilla JS, hosted on Firebase.

---

## 1. The dual-world concept

The page contains **two portfolios in one**:

- **Technical world** — Data Scientist / ML & GenAI (the original site).
- **Startup world** — founder journey, indigo-themed.

Every section is tagged `data-world="technical"` or `data-world="startup"`.
The `<body>` carries `data-mode="technical|startup"`, and CSS shows only the
matching world:

```css
body[data-mode="technical"] [data-world="startup"]  { display: none !important; }
body[data-mode="startup"]   [data-world="technical"] { display: none !important; }
```

A pill **toggle** in the navbar switches `data-mode` (see `js/startup.js`).
Shared chrome (navbar, footer, contact, AI chat, cursor, preloader) has no
`data-world` tag, so it shows in both.

### Three shareable links (access gate)

`js/access.js` runs **first** and reads the URL:

| URL | Behaviour |
| --- | --- |
| `/` or `?v=all` | both worlds, toggle visible |
| `?v=technical` or `/technical` | locks to Technical, hides the toggle, **removes** the Startup DOM |
| `?v=startup` or `/startup` | locks to Startup, hides the toggle, **removes** the Technical DOM |

Locking removes the other world's nodes entirely (so its canvases/audio never
initialise). The pretty `/technical` and `/startup` paths work via `rewrites`
in `firebase.json`; the `?v=` form works everywhere.

> ⚠️ This is **UI-level** gating, not security — both worlds still exist in the
> page source. For hard separation you'd build two separate HTML files.

---

## 2. File map

### CSS (`css/`, loaded in this order)
| File | Contains |
| --- | --- |
| `base.css` | CSS variables, reset, utilities (`.gradient-text`, `.highlight`), global animations |
| `chrome.css` | preloader (intro), custom cursor, navbar, marquee, footer |
| `hero.css` | hero layout, orbs/decorations, live terminal, logo cloud, code snippets, 3D graph |
| `sections.css` | about, skills, experience/timeline, dashboard, publications, achievements, education, contact |
| `chat.css` | AI chat widget |
| `responsive.css` | technical-world media queries (incl. mobile hero stacking) |
| `startup.css` | the entire Startup world: mode toggle, indigo theme, ventures, timeline, dashboards, audio player, people |

### JS (`js/`, each is an IIFE; order matters only for `access.js` first)
| File | Contains |
| --- | --- |
| `access.js` | the `?v=` access gate (must run first) |
| `effects.js` | preloader/intro, custom cursor, scroll progress, parallax, magnetic hover, scroll-reveal, smooth scroll |
| `hero.js` | neural-net canvas, typing effect, navbar scroll, shrink-box, stat counters, live code terminal, 3D knowledge graph |
| `widgets.js` | technical dashboard animations, **AI chat** (mode-aware) |
| `startup.js` | world toggle + `setMode`, startup hero canvas/typing/counters, startup dashboards, **MP3 audio player**, clickable venture cards |

### Assets (`assets/`)
- `img/` — `eswar-profile.jpg`, venture logos (`prebiotic-soda-logo.svg`,
  `quickkirana-logo.jpeg`, `orbit-logo.svg`), `orbit-shots/` (app screenshots),
  `orbit-docs/` (rendered pitch/pamphlet pngs).
- `audio/` — `story-soda.mp3`, `story-kirana.mp3`, `story-orbit.mp3` (narration).
- `docs/` — resume PDF + `Orbit-Pitch.pdf`, `Orbit-Rider-Pamphlet.pdf`.

---

## 3. The intro (preloader)

A **name-reveal + curtain** animation (`css/chrome.css` `.pl-*`, driven by
`js/effects.js`):

1. The initials **`E`** and **`A`** fade in tight (reads as the `EA.` monogram,
   with the orange brand dot).
2. They **unfurl** — `E → Eswar`, `A → Adapa` — the rest of each name expanding
   from its initial (the word gap animates from tight to a real space).
3. Tagline *"Engineering intelligence. Building ventures."* + a progress line.
4. The dark screen **lifts like a curtain** to reveal the hero.

**Performance:** the full intro plays **once per browser session**
(`sessionStorage.introSeen`). Reloads skip it and show the page instantly.

---

## 4. Startup world sections

1. **Builder's Mindset** — the spark (Zepto / Mamaearth podcasts) + a quote.
2. **Ventures** — three cards (clickable → their deep dive).
3. **The Timeline** — chronological journey across all ventures.
4. **Inside Each Venture** — per-venture case studies (6-beat arc) with data dashboards.
5. **Lessons Learned** — distilled cross-venture lessons.
6. **Built With** — collaborators.

### The three ventures (and where the data came from)
| # | Venture | Source |
| --- | --- | --- |
| 01 | **Prebiotic Soda** | `docs/startup_google_docs/startup1/` + voice note |
| 02 | **Quick Kirana** (dark-kirana q-commerce) | `docs/startup_google_docs/startup2/` (incl. the 49-participant field log & unit-economics table) |
| 03 | **Orbit / Evigo** (EV bike taxi, live) | `/mnt/data/Client_Req/evigo/` — pitch deck, pamphlets, the live apps |

Orbit's deep dive links the **live apps** (rider/captain/admin/backend), shows
**real app screenshots**, an **economics dashboard**, a **pilot log**, and the
**pitch deck + pamphlets**.

> Note: the Quick Kirana "Ops cost ₹5 vs ₹22" figure is taken from the
> *Dark Kirana* doc's unit-economics table (Operations Cost row).

---

## 5. Audio storyteller

Each venture has a **narrated story** with a custom **waveform player**
(`js/startup.js`, `css/startup.css` `.audio-player`):

- Play/pause, click-to-seek on the waveform, speed cycle (1× / 1.25× / 1.5× / 2×).
- Played bars fill + gently animate; no time readout (kept minimal).

**Voice:** generated with **Kokoro-82M** (open-source neural TTS), voice
`am_michael` (clear American male). To regenerate:

```bash
# one-time setup
python3 -m venv /tmp/kokoroenv
/tmp/kokoroenv/bin/pip install kokoro soundfile numpy lameenc
# then run a short script: KPipeline(lang_code='a') → voice='am_michael'
# → int16 PCM → lameenc → assets/audio/story-*.mp3   (24 kHz mono, 128 kbps)
```

Voices tried along the way: `en-IN-PrabhatNeural` (edge-tts, Indian — too
robotic), Kokoro `hm_psi` (Indian — unclear), settled on Kokoro `am_michael`.
Other Kokoro options: `am_puck`, `am_fenrir`, `bm_george`, `bm_fable`.

---

## 6. AI chat (mode-aware)

The floating chat (`js/widgets.js`) swaps its knowledge base and suggestion
chips based on the current world:

- **Technical mode** → answers about ML, Sherlock AI, tech stack, contact.
- **Startup mode** → answers about Orbit, Quick Kirana, the soda, lessons, people.

It listens for the `sitemodechange` event dispatched by `setMode` and rebuilds
itself. It's a local keyword-matcher (no backend / API).

---

## 7. Motion & canvas

- **Technical hero:** neural-net particle canvas, floating code snippets, a 3D
  rotatable knowledge graph, a typing-code terminal, animated stat counters.
- **Startup hero:** rising indigo "bubble network" canvas, typing roles.
- Shared: custom cursor, magnetic buttons, scroll-reveal (IntersectionObserver),
  parallax, marquee tickers, dashboard chart animations.
- All respect `prefers-reduced-motion` where it matters (intro).

---

## 8. Caching strategy (`firebase.json`)

Firebase applies **last-matching** header rule, so order is: general first,
specific after.

| Files | Cache-Control | Why |
| --- | --- | --- |
| everything (`**`) | `no-cache, must-revalidate` | HTML always fresh |
| `*.css`, `*.js` | `max-age=31536000` (1 yr) | safe — they're `?v=N` version-tagged |
| images / fonts / pdf / mp3 | `max-age=86400` (1 day) | rarely change |

So reloads are fast (assets cached) **and** content stays current (HTML
revalidates; CSS/JS bust via the `?v=N` bump on each deploy).

---

## 9. Known notes / gotchas

- **Mobile page-jitter (fixed):** the hero was `flex-row` on mobile, so the
  typing terminal squeezed the text and reflowed the page. Fixed by stacking the
  hero (`flex-direction: column`) on `max-width: 768px`.
- **Firebase CLI:** the plain `firebase` binary segfaults on this ARM64/QEMU VM;
  always use the node-based path (see DEPLOYMENT.md).
- **`_backup/`** holds the original single-file `index.html` / `styles.css` /
  `script.js` from before the modular refactor. Not deployed.
