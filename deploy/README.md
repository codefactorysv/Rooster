# Deploying Rooster to the shared VPS

Both scripts run **as root on the server**. They are written for a VPS that
already hosts other production sites: they touch only `/var/www/rooster`, one
pm2 process named `rooster`, and one new reverse-proxy file for
`roosterserviceshtx.com`. Everything else is left alone.

## 1. Reconnaissance (read-only)

```bash
ssh root@157.173.192.94
curl -fsSL https://raw.githubusercontent.com/codefactorysv/Rooster/claude/rooster-tree-landing-build-ao4snk/deploy/recon.sh | bash
```

Prints ports in use, running services, Docker containers, the reverse proxy
(Caddy or Nginx) with its sites, tool versions, whether pm2 boot startup is
already configured, and a `SUGGESTED_PORT`. It also saves the HTTP status of
every existing site to `/root/rooster-baseline.txt` — `deploy.sh` compares
against it afterwards to prove nothing else changed.

## 2. Deploy

```bash
PORT=<SUGGESTED_PORT> bash <(curl -fsSL https://raw.githubusercontent.com/codefactorysv/Rooster/claude/rooster-tree-landing-build-ao4snk/deploy/deploy.sh)
```

What it does, in order:

1. Refuses if the port is in use by anything other than an existing `rooster` process.
2. Uses the system Node if it is ≥ 20; otherwise installs Node 22 via nvm in
   `/root/.nvm` without touching the system version. Installs pm2 only if missing.
3. Clones (or updates) the `claude/rooster-tree-landing-build-ao4snk` branch —
   the only branch in the repository — into `/var/www/rooster`.
4. Creates `.env.local` on the first run (never overwrites it). **Fill in
   `RESEND_API_KEY` and `CONTACT_TO_EMAIL`** or the estimate form will answer
   "please call us".
5. `npm ci` + `npm run build`.
6. Starts / restarts pm2 process `rooster` (`next start -p PORT`), `pm2 save`,
   and runs `pm2 startup` **only if no pm2 systemd unit exists yet**.
7. Writes ONE proxy file and validates before reloading — never restarts:
   - Caddy: `/etc/caddy/sites/roosterserviceshtx.com.caddy` (+ one `import`
     line appended to the Caddyfile if it has none; a timestamped backup is
     kept). HTTPS is automatic.
   - Nginx: `/etc/nginx/sites-available/roosterserviceshtx.com` + symlink, then
     `certbot --nginx`. Set `CERTBOT_EMAIL=you@example.com` to register with an email.
8. Verifies the app on `127.0.0.1:PORT`, the domain over HTTPS, and every
   pre-existing site against the baseline.

## Updating later

```bash
cd /var/www/rooster && git pull && npm ci && npm run build && pm2 restart rooster
```

or simply re-run `bash deploy/deploy.sh` (it reads the port from pm2).

## Useful

```bash
pm2 logs rooster        # app logs
pm2 describe rooster    # port, uptime, restarts
```
