# Eswar Adapa — Personal Portfolio

A dual-world personal site: a **Technical** portfolio (Data Scientist / ML & GenAI)
and a **Startup** portfolio (founder journey), toggled live on a single page.

**Live:** https://eswar-adapa.web.app

| Link | Shows |
| --- | --- |
| `https://eswar-adapa.web.app/` | Both worlds + the toggle |
| `https://eswar-adapa.web.app/?v=technical` (or `/technical`) | Technical world only |
| `https://eswar-adapa.web.app/?v=startup` (or `/startup`) | Startup world only |

> 📐 Full feature + architecture reference: **[ARCHITECTURE.md](ARCHITECTURE.md)**
> 🚀 How to deploy: **[DEPLOYMENT.md](DEPLOYMENT.md)**

---

## Project structure

```
personal_website/
├── index.html              # single page — both worlds
├── firebase.json           # hosting + cache headers + pretty-URL rewrites
├── css/                    # base · chrome · hero · sections · chat · responsive · startup
├── js/                     # access · effects · hero · widgets · startup
├── assets/
│   ├── img/                # profile, logos, orbit-shots/, orbit-docs/ (pngs)
│   ├── audio/              # story-soda / story-kirana / story-orbit .mp3 (narration)
│   └── docs/               # resume + Orbit pitch/pamphlet PDFs
├── README.md · ARCHITECTURE.md · DEPLOYMENT.md   # docs (not deployed)
├── docs/                   # raw startup source material (not deployed)
└── _backup/                # original pre-refactor monolith files (not deployed)
```

CSS and JS are split into focused modules and loaded in order from `index.html`
(with `?v=N` cache-busting tags). See [ARCHITECTURE.md](ARCHITECTURE.md) for what
each file does.

---

## Run locally

```bash
cd /mnt/data/Area_Analysis_Dev/Dev/temp2/personal_website
python3 -m http.server 8090
# → open http://localhost:8090
```

Test the access links locally with the query param, e.g.
`http://localhost:8090/?v=startup`. (The pretty `/startup` path only works on
Firebase, via the rewrites in `firebase.json`.)

Stop the server:

```bash
kill $(lsof -t -i:8090)
```

---

## Deploy

The site is on **Firebase Hosting** (project `orbit-bike-tax`, site `eswar-adapa`).
On this ARM64 VM the plain `firebase` binary is broken, so use the node-based CLI:

```bash
cd /mnt/data/Area_Analysis_Dev/Dev/temp2/personal_website
~/.nvm/versions/node/v25.9.0/bin/node \
  ~/.nvm/versions/node/v25.9.0/lib/node_modules/firebase-tools/lib/bin/firebase.js \
  deploy --only hosting:eswar-adapa
```

After editing CSS/JS, bump the `?v=N` tags in `index.html` so browsers fetch the
new files. Full details + the "why the command is so long" story: [DEPLOYMENT.md](DEPLOYMENT.md).

---

## Common edits

| I want to… | Where |
| --- | --- |
| Change Technical content (skills, experience, stats) | `index.html` (sections tagged `data-world="technical"`) |
| Change Startup content (ventures, lessons, people) | `index.html` (sections tagged `data-world="startup"`) |
| Add a 4th venture | duplicate a `.venture-card` + a `.venture-detail` block; see ARCHITECTURE.md |
| Re-record the audio stories | regenerate MP3s in `assets/audio/` (Kokoro, see ARCHITECTURE.md) |
| Edit the AI chat answers | `js/widgets.js` (`KB.technical` / `KB.startup`) |
| Tune the intro animation | `css/chrome.css` (`.pl-*`) + `js/effects.js` |

---

## Self-host fallback (nginx)

`nginx-eswar-site.conf` is kept as a fallback for serving from this VM directly.
We use Firebase instead (free HTTPS + clean URL). See DEPLOYMENT.md.
