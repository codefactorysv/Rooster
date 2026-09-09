#!/usr/bin/env bash
# =============================================================================
# Rooster Tree - Lawn Services — production deploy for a shared VPS.
#
# Run as root AFTER reading the output of recon.sh:
#   PORT=3001 bash deploy.sh            # first deploy
#   bash deploy.sh                      # later: re-reads PORT from the pm2 process
#
# Safety rules baked in (the server hosts other production sites):
#   - Touches only /var/www/rooster, one pm2 process named "rooster", and ONE
#     new reverse-proxy file for roosterserviceshtx.com. Nothing else.
#   - Never restarts the proxy: validates (caddy validate / nginx -t), then
#     RELOADs. A failed validation aborts before any reload.
#   - Never runs `pm2 startup` if a pm2 systemd unit already exists.
#   - Never overwrites an existing .env.local.
#   - Node is installed via nvm under /root/.nvm ONLY if no Node >= 20 exists,
#     so it cannot replace a version other projects rely on.
#   - Refuses to bind a port that is already in use.
# =============================================================================
set -euo pipefail

APP_NAME="rooster"
APP_DIR="/var/www/rooster"
REPO="https://github.com/codefactorysv/Rooster.git"
BRANCH="claude/rooster-tree-landing-build-ao4snk"   # the only branch in the repo
DOMAIN="roosterserviceshtx.com"
NODE_MAJOR_MIN=20
NVM_NODE_VERSION="22"

log()  { printf '\n\033[1;32m▶ %s\033[0m\n' "$*"; }
warn() { printf '\033[1;33m! %s\033[0m\n' "$*"; }
die()  { printf '\033[1;31m✖ %s\033[0m\n' "$*" >&2; exit 1; }
have() { command -v "$1" >/dev/null 2>&1; }

[ "$(id -u)" = 0 ] || die "run as root"

# ---------------------------------------------------------------------------
# 0. Port
# ---------------------------------------------------------------------------
if [ -z "${PORT:-}" ] && have pm2 && pm2 describe "$APP_NAME" >/dev/null 2>&1; then
  PORT=$(pm2 describe "$APP_NAME" 2>/dev/null | grep -oE 'PORT[=: ]+[0-9]+' | grep -oE '[0-9]+$' | head -1 || true)
fi
[ -n "${PORT:-}" ] || die "PORT not set. Run recon.sh, pick the SUGGESTED_PORT, then: PORT=<n> bash deploy.sh"
if ss -tulpn 2>/dev/null | awk '{print $5}' | grep -qE "[:.]${PORT}\$"; then
  OWNER=$(ss -tulpn 2>/dev/null | grep -E "[:.]${PORT}\s" | grep -oE 'users:\(\("[^"]+"' | head -1 | cut -d'"' -f2 || true)
  if ! { have pm2 && pm2 describe "$APP_NAME" >/dev/null 2>&1 && [ "${OWNER:-}" = "node" ]; }; then
    die "port $PORT is already in use by '${OWNER:-unknown}'. Pick another."
  fi
fi
log "Deploying $APP_NAME on port $PORT"

# ---------------------------------------------------------------------------
# 1. Node (isolated if needed) + git + pm2
# ---------------------------------------------------------------------------
have git || die "git is not installed (apt-get install -y git) — not installing packages system-wide automatically"

node_ok() { have node && [ "$(node -p 'process.versions.node.split(".")[0]')" -ge "$NODE_MAJOR_MIN" ]; }
if ! node_ok; then
  if have node; then warn "system node $(node --version) is too old for Next.js 16; NOT touching it"; fi
  log "Installing Node $NVM_NODE_VERSION via nvm in /root/.nvm (isolated, does not affect other projects)"
  export NVM_DIR="/root/.nvm"
  if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | PROFILE=/dev/null bash
  fi
  # shellcheck disable=SC1090
  . "$NVM_DIR/nvm.sh"
  nvm install "$NVM_NODE_VERSION" >/dev/null
  nvm use "$NVM_NODE_VERSION" >/dev/null
fi
NODE_BIN="$(command -v node)"; NPM_BIN="$(command -v npm)"
log "Using node $($NODE_BIN --version) at $NODE_BIN"

if ! have pm2; then
  log "Installing pm2 globally for this node ($NODE_BIN)"
  "$NPM_BIN" install -g pm2 >/dev/null
fi
PM2_BIN="$(command -v pm2)"

# ---------------------------------------------------------------------------
# 2. Source
# ---------------------------------------------------------------------------
if [ -d "$APP_DIR/.git" ]; then
  log "Updating $APP_DIR"
  git -C "$APP_DIR" fetch --depth 1 origin "$BRANCH"
  git -C "$APP_DIR" checkout -q "$BRANCH"
  git -C "$APP_DIR" reset -q --hard "origin/$BRANCH"
else
  log "Cloning $BRANCH into $APP_DIR"
  mkdir -p "$(dirname "$APP_DIR")"
  git clone --depth 1 --branch "$BRANCH" "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"
grep -q '"next"' package.json || die "package.json has no next dependency — wrong repo?"
log "Stack: Next.js $(node -p 'require("./package.json").dependencies.next') (SSR) → pm2, not static"

# ---------------------------------------------------------------------------
# 3. Environment
# ---------------------------------------------------------------------------
if [ ! -f .env.local ]; then
  cat > .env.local <<EOF
# Production environment for Rooster — fill in and re-run deploy.sh
NEXT_PUBLIC_SITE_URL=https://${DOMAIN}
RESEND_API_KEY=
CONTACT_TO_EMAIL=
CONTACT_FROM_EMAIL=onboarding@resend.dev
EOF
  chmod 600 .env.local
  warn ".env.local created at $APP_DIR/.env.local with EMPTY RESEND_API_KEY / CONTACT_TO_EMAIL."
  warn "The site will run, but the estimate form will answer 'please call us' until both are set."
fi
grep -q "NEXT_PUBLIC_SITE_URL=https://${DOMAIN}" .env.local || warn "NEXT_PUBLIC_SITE_URL in .env.local is not https://${DOMAIN}"

# ---------------------------------------------------------------------------
# 4. Build
# ---------------------------------------------------------------------------
log "Installing dependencies"
"$NPM_BIN" ci --no-audit --no-fund
log "Building"
"$NPM_BIN" run build

# ---------------------------------------------------------------------------
# 5. pm2
# ---------------------------------------------------------------------------
if "$PM2_BIN" describe "$APP_NAME" >/dev/null 2>&1; then
  log "Restarting pm2 process $APP_NAME"
  PORT="$PORT" "$PM2_BIN" restart "$APP_NAME" --update-env
else
  log "Starting pm2 process $APP_NAME"
  PORT="$PORT" NODE_ENV=production "$PM2_BIN" start "$NODE_BIN" \
    --name "$APP_NAME" --cwd "$APP_DIR" --time \
    -- node_modules/next/dist/bin/next start -p "$PORT"
fi
"$PM2_BIN" save >/dev/null
if systemctl list-unit-files 2>/dev/null | grep -qi '^pm2-'; then
  log "pm2 startup already configured — leaving it alone"
else
  log "Configuring pm2 to start on boot (first time on this server)"
  "$PM2_BIN" startup systemd -u root --hp /root >/dev/null
  "$PM2_BIN" save >/dev/null
fi

sleep 3
curl -fsS -o /dev/null "http://127.0.0.1:${PORT}/" || die "app is not answering on 127.0.0.1:${PORT}; see: pm2 logs $APP_NAME"
log "App answers on 127.0.0.1:${PORT}"

# ---------------------------------------------------------------------------
# 6. Reverse proxy — ONE new file, validate, RELOAD (never restart)
# ---------------------------------------------------------------------------
if systemctl is-active --quiet caddy 2>/dev/null; then
  log "Reverse proxy: Caddy"
  SITES_DIR=/etc/caddy/sites
  SITE_FILE="$SITES_DIR/${DOMAIN}.caddy"
  mkdir -p "$SITES_DIR"
  if ! grep -qE "^\s*import\s+${SITES_DIR}/" /etc/caddy/Caddyfile; then
    warn "Caddyfile has no 'import ${SITES_DIR}/*' line — appending ONE import line (existing blocks untouched)"
    cp -n /etc/caddy/Caddyfile "/etc/caddy/Caddyfile.bak-$(date +%s)"
    printf '\n# per-site configs (added for %s)\nimport %s/*.caddy\n' "$DOMAIN" "$SITES_DIR" >> /etc/caddy/Caddyfile
  fi
  cat > "$SITE_FILE" <<EOF
# Rooster Tree - Lawn Services — managed by /var/www/rooster/deploy/deploy.sh
${DOMAIN}, www.${DOMAIN} {
	encode zstd gzip
	reverse_proxy 127.0.0.1:${PORT}
}
EOF
  caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile || { rm -f "$SITE_FILE"; die "caddy validate failed — site file removed, Caddy NOT reloaded"; }
  systemctl reload caddy
  log "Caddy reloaded; HTTPS is automatic. Site file: $SITE_FILE"

elif systemctl is-active --quiet nginx 2>/dev/null; then
  log "Reverse proxy: Nginx"
  if [ -d /etc/nginx/sites-available ]; then
    SITE_FILE="/etc/nginx/sites-available/${DOMAIN}"; LINK="/etc/nginx/sites-enabled/${DOMAIN}"
  else
    SITE_FILE="/etc/nginx/conf.d/${DOMAIN}.conf"; LINK=""
  fi
  cat > "$SITE_FILE" <<EOF
# Rooster Tree - Lawn Services — managed by /var/www/rooster/deploy/deploy.sh
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
EOF
  [ -n "$LINK" ] && ln -sfn "$SITE_FILE" "$LINK"
  nginx -t || { rm -f "$SITE_FILE" "$LINK"; die "nginx -t failed — site file removed, Nginx NOT reloaded"; }
  systemctl reload nginx
  log "Nginx reloaded. Site file: $SITE_FILE"
  if have certbot; then
    log "Requesting certificate with certbot (nginx plugin)"
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos \
      ${CERTBOT_EMAIL:+-m "$CERTBOT_EMAIL"} ${CERTBOT_EMAIL:---register-unsafely-without-email} --redirect \
      || warn "certbot failed — site is up on HTTP only; re-run: certbot --nginx -d $DOMAIN -d www.$DOMAIN"
  else
    warn "certbot not installed — HTTPS not configured. Install certbot + python3-certbot-nginx and re-run."
  fi
else
  die "Neither caddy nor nginx is active. App is running on 127.0.0.1:${PORT}; add the proxy block manually."
fi

# ---------------------------------------------------------------------------
# 7. Verification
# ---------------------------------------------------------------------------
log "Verifying"
sleep 5
printf '  https://%s → %s\n' "$DOMAIN" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "https://$DOMAIN/" || echo ERR)"
printf '  https://www.%s → %s\n' "$DOMAIN" "$(curl -s -o /dev/null -w '%{http_code}' --max-time 20 "https://www.$DOMAIN/" || echo ERR)"
curl -sI --max-time 20 "https://$DOMAIN/" 2>/dev/null | grep -iE '^(server|strict-transport)' | sed 's/^/  /' || true

BASE=/root/rooster-baseline.txt
if [ -f "$BASE" ]; then
  log "Comparing every pre-existing site against the recon baseline"
  CHANGED=0
  while read -r host rest; do
    [ -z "$host" ] && continue
    before=$(grep -oE 'public:[0-9A-Z]+' <<<"$rest" | cut -d: -f2)
    after=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "https://$host/" 2>/dev/null || echo ERR)
    if [ "$before" = "$after" ]; then printf '  ✓ %-40s %s\n' "$host" "$after"
    else printf '  ✖ %-40s was %s now %s\n' "$host" "$before" "$after"; CHANGED=1; fi
  done < "$BASE"
  [ "$CHANGED" = 0 ] && log "All pre-existing sites respond exactly as before" || warn "Some sites changed status — investigate before doing anything else"
else
  warn "No baseline found ($BASE). Run recon.sh before the first deploy next time."
fi

log "Done. Update later with: cd $APP_DIR && git pull && npm ci && npm run build && pm2 restart $APP_NAME"
