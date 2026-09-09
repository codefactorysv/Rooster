#!/usr/bin/env bash
# =============================================================================
# Rooster — server reconnaissance. READ-ONLY.
#
# Run as root on the VPS BEFORE deploying:
#   bash recon.sh
#
# It changes nothing. It prints what is already running, what tooling exists,
# which reverse proxy is in use, proposes a free port for Rooster, and records
# a baseline of every existing site's HTTP status to /root/rooster-baseline.txt
# so deploy.sh can prove afterwards that nothing else was affected.
# =============================================================================
set -uo pipefail

hr() { printf '\n\033[1m== %s ==\033[0m\n' "$1"; }
have() { command -v "$1" >/dev/null 2>&1; }

hr "System"
. /etc/os-release 2>/dev/null && echo "$PRETTY_NAME"
uname -r; uptime -p 2>/dev/null; echo "Disk:"; df -h / | tail -1

hr "Listening ports (ss -tulpn)"
ss -tulpn 2>/dev/null | grep -v '^Netid' | sort -k5 || netstat -tulpn 2>/dev/null

hr "Running systemd services"
systemctl list-units --type=service --state=running --no-pager --no-legend | awk '{print $1}'

hr "Docker"
if have docker; then
  docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}\t{{.Status}}' 2>/dev/null || echo "docker present but daemon not reachable"
else
  echo "docker: not installed"
fi

hr "Reverse proxy"
PROXY=none
if systemctl is-active --quiet caddy 2>/dev/null || have caddy; then
  PROXY=caddy
  echo "Caddy: $(caddy version 2>/dev/null | head -1)"
  echo "--- /etc/caddy/Caddyfile ---"; cat /etc/caddy/Caddyfile 2>/dev/null
  echo "--- imported/extra site files ---"
  find /etc/caddy -type f ! -name Caddyfile 2>/dev/null | sort
fi
if systemctl is-active --quiet nginx 2>/dev/null || have nginx; then
  PROXY=${PROXY/none/nginx}; [ "$PROXY" = caddy ] && PROXY="caddy+nginx"
  echo "Nginx: $(nginx -v 2>&1)"
  echo "--- enabled sites ---"
  ls -la /etc/nginx/sites-enabled/ 2>/dev/null; ls -la /etc/nginx/conf.d/ 2>/dev/null
  echo "--- server_name entries ---"
  grep -rhoE 'server_name\s+[^;]+' /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null | sort -u
  echo "--- certbot ---"; have certbot && certbot certificates 2>/dev/null | grep -E 'Certificate Name|Domains|Expiry' || echo "certbot: not installed"
fi
echo "PROXY_DETECTED=$PROXY"

hr "Tooling"
for t in git node npm pnpm yarn pm2 nvm; do
  if [ "$t" = nvm ]; then
    [ -s "$HOME/.nvm/nvm.sh" ] && echo "nvm: installed at $HOME/.nvm" || echo "nvm: -"
  elif have "$t"; then printf '%-5s %s  (%s)\n' "$t" "$("$t" --version 2>/dev/null | head -1)" "$(command -v "$t")"
  else printf '%-5s -\n' "$t"; fi
done
if have pm2; then
  echo "--- pm2 list ---"; pm2 list 2>/dev/null
  echo "--- pm2 startup unit ---"
  systemctl list-unit-files 2>/dev/null | grep -i pm2 || echo "no pm2 systemd unit (pm2 startup NOT configured)"
fi

hr "Existing site directories"
for d in /var/www /srv /opt /home/*/apps /root/apps; do [ -d "$d" ] && { echo "$d:"; ls -la "$d" 2>/dev/null | tail -n +2; }; done

hr "Free port proposal"
USED=$(ss -tulpn 2>/dev/null | awk '{print $5}' | grep -oE '[0-9]+$' | sort -un)
for p in 3000 3001 3002 3003 3004 3005 3010 3020 3030 4000 4001 5000 5001 8080 8081 8090; do
  if ! grep -qx "$p" <<<"$USED"; then echo "SUGGESTED_PORT=$p"; break; fi
done

hr "Baseline of existing sites (for post-deploy comparison)"
BASE=/root/rooster-baseline.txt
{
  HOSTS=$( { grep -rhoE '^[a-z0-9.-]+\.[a-z]{2,}(,\s*[a-z0-9.-]+\.[a-z]{2,})*\s*\{' /etc/caddy 2>/dev/null | tr -d '{' | tr ',' '\n';
             grep -rhoE 'server_name\s+[^;]+' /etc/nginx/sites-enabled /etc/nginx/conf.d 2>/dev/null | sed 's/server_name//'; } \
           | tr ' ' '\n' | grep -E '^[a-z0-9.-]+\.[a-z]{2,}$' | grep -v '^_$' | sort -u )
  for h in $HOSTS; do
    code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 -H "Host: $h" "https://127.0.0.1/" -k 2>/dev/null || echo ERR)
    pub=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 "https://$h/" 2>/dev/null || echo ERR)
    printf '%-40s local:%s public:%s\n' "$h" "$code" "$pub"
  done
} | tee "$BASE"
echo "Baseline saved to $BASE ($(wc -l < "$BASE") hosts)"

hr "Done — nothing was changed."
