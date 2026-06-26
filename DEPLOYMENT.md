# Deployment Guide — Eswar Adapa Portfolio

This site is deployed to **Firebase Hosting** (free, automatic HTTPS, global CDN).

## 🌐 Live site

**https://eswar-adapa.web.app**

- Project: `orbit-bike-tax` (shared with the Orbit apps)
- Hosting site ID: `eswar-adapa`
- Plan: Firebase Spark (free)

---

## 📁 What gets deployed

Only the website files are published. These are configured in [firebase.json](firebase.json):

| Published | Excluded (kept private) |
| --- | --- |
| `index.html` | `README.md` |
| `styles.css` | `DEPLOYMENT.md` (this file) |
| `script.js` | `nginx-eswar-site.conf` |
| `eswar-profile.jpg` | `1000067978 (1).JPG` (unused duplicate) |
| `assets/docs/Eswar_Adapa_Resume.pdf` | `.firebaserc`, `firebase.json`, dotfiles |

To change what's published, edit the `"ignore"` list in `firebase.json`.

---

## 🚀 How to redeploy (after editing the site)

> ⚠️ **Important:** On this Azure VM, the plain `firebase` command does **not** work
> (see "Why the command is so long" below). Always use the full command:

```bash
cd /mnt/data/Area_Analysis_Dev/Dev/temp2/personal_website

~/.nvm/versions/node/v25.9.0/bin/node \
  ~/.nvm/versions/node/v25.9.0/lib/node_modules/firebase-tools/lib/bin/firebase.js \
  deploy --only hosting:eswar-adapa
```

A successful deploy ends with:

```
✔  Deploy complete!
Hosting URL: https://eswar-adapa.web.app
```

### Optional: make it a short command

Add this alias once so you can just type `fb`:

```bash
echo "alias fb='~/.nvm/versions/node/v25.9.0/bin/node ~/.nvm/versions/node/v25.9.0/lib/node_modules/firebase-tools/lib/bin/firebase.js'" >> ~/.bashrc
source ~/.bashrc
```

Then redeploy with:

```bash
cd /mnt/data/Area_Analysis_Dev/Dev/temp2/personal_website
fb deploy --only hosting:eswar-adapa
```

---

## 🔎 Verify the site is live

```bash
curl -s -o /dev/null -w "HTTP %{http_code}\n" https://eswar-adapa.web.app/
```

Should print `HTTP 200`.

---

## 🧰 Why the command is so long (the gotchas we hit)

This Azure VM is **ARM64 (aarch64) running under QEMU**. That caused two problems
during setup, both now solved:

1. **npm was broken.** Both nvm node installs had a missing `lib/node_modules`,
   so `npm` and the global `firebase` shim didn't exist. Fixed by bootstrapping
   npm directly from the registry and installing `firebase-tools` with the
   working ARM64 node.

2. **The standalone Firebase binary crashes.** The official `firebase.tools`
   binary bundles an x86_64 node, which segfaults under QEMU
   (`x86_64-binfmt-P: QEMU internal SIGSEGV`). The `firebase` shim also fails
   because `#!/usr/bin/env node` can pick up a stray x86_64 node.

**The fix / rule:** always invoke Firebase by passing `firebase.js` to the
**ARM64 node explicitly** — that's exactly what the long command above does.

- Working node: `~/.nvm/versions/node/v25.9.0/bin/node` (arch: `arm64`)
- firebase-tools: `15.20.0`

---

## 🌍 Add a custom domain later (optional, free)

If you buy a domain (e.g. `eswaradapa.com`):

1. Firebase Console → project `orbit-bike-tax` → **Hosting** → site `eswar-adapa`
   → **Add custom domain**.
2. Firebase gives you DNS records (an `A` record or `TXT` for verification).
3. Add those records at your domain registrar (Cloudflare, Namecheap, etc.).
4. Firebase provisions a free SSL certificate automatically (takes a few minutes
   to a few hours).

No code or redeploy needed — the domain just points at the existing site.

---

## 🖥️ Alternative: self-host on this VM with nginx (not used)

The repo also contains [nginx-eswar-site.conf](nginx-eswar-site.conf) for serving
the site directly from this VM. We chose Firebase instead because it gives free
HTTPS and a clean shareable URL with no firewall/port configuration. The nginx
path is kept only as a fallback — see [README.md](README.md) for those steps.
