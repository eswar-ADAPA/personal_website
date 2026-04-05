# Eswar Adapa — Personal Portfolio Website

## Files

- `index.html` — Main page
- `styles.css` — Styling
- `script.js` — Animations and interactions
- `eswar-profile.jpg` — Profile image
- `Eswar_Resume.pdf` — Resume (downloadable from site)

## Quick Start

### Run locally (foreground)

```bash
cd /mnt/data/Area_Analysis_Dev/eswar/personal_website
python3 -m http.server <PORT>
```

Example: `python3 -m http.server 8090` → visit `http://localhost:8090`

### Run in background (keeps running after closing terminal)

```bash
cd /mnt/data/Area_Analysis_Dev/eswar/personal_website
nohup python3 -m http.server <PORT> > /dev/null 2>&1 &
```

### Stop the server

```bash
kill $(lsof -t -i:<PORT>)
```

## Run with Nginx

1. Copy the config:

```bash
sudo cp nginx-eswar-site.conf /etc/nginx/sites-available/eswar-website
sudo ln -sf /etc/nginx/sites-available/eswar-website /etc/nginx/sites-enabled/eswar-website
```

2. Edit the port in the config if needed:

```bash
sudo nano /etc/nginx/sites-available/eswar-website
```

3. Test and start:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

## Azure VM Setup

Make sure the port you choose is open in the Azure Network Security Group (NSG):

1. Azure Portal → VM → Networking
2. Add inbound port rule → Port: `<PORT>`, Protocol: TCP, Action: Allow

## Domain Setup (DuckDNS - Free)

1. Go to [duckdns.org](https://www.duckdns.org), sign in
2. Create a subdomain, point it to your VM's public IP
3. Access via `http://<subdomain>.duckdns.org:<PORT>`

## Domain Setup (Custom Domain - Paid)

1. Buy a domain (Cloudflare, Namecheap, etc.)
2. Add an A record pointing to your VM's public IP
3. Update nginx `server_name` to your domain
4. Add SSL:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```
