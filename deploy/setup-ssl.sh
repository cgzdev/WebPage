#!/usr/bin/env bash
set -euo pipefail

DOMAIN="pinakothek60aniv.csm.edu.mx"
EMAIL="admin@${DOMAIN#*.}"

if [[ $EUID -ne 0 ]]; then
  echo "Please run as root (sudo)." >&2
  exit 1
fi

detect_pkg_manager() {
  if command -v apt-get >/dev/null 2>&1; then echo apt; return; fi
  if command -v dnf >/dev/null 2>&1; then echo dnf; return; fi
  if command -v yum >/dev/null 2>&1; then echo yum; return; fi
  echo none
}

PKG_MGR=$(detect_pkg_manager)
echo "Detected package manager: $PKG_MGR"

echo "Updating packages..."
case "$PKG_MGR" in
  apt)
    apt-get update -y ;;
  dnf)
    dnf -y update || true ;;
  yum)
    yum -y update || true ;;
  *)
    echo "Unsupported OS: please install Nginx and Certbot manually." >&2
    exit 1 ;;
esac

echo "Installing Nginx..."
case "$PKG_MGR" in
  apt) apt-get install -y nginx ;;
  dnf) dnf install -y nginx ;;
  yum) yum install -y nginx ;;
esac

echo "Installing Certbot..."
if [[ "$PKG_MGR" == "apt" ]]; then
  if command -v snap >/dev/null 2>&1; then
    snap install core; snap refresh core
    snap install --classic certbot
    ln -sf /snap/bin/certbot /usr/bin/certbot
  else
    apt-get install -y certbot python3-certbot-nginx
  fi
else
  # RHEL/CentOS/Alma/Rocky
  if [[ "$PKG_MGR" == "dnf" ]]; then
    dnf install -y epel-release || true
    dnf install -y certbot python3-certbot-nginx
  else
    yum install -y epel-release || true
    yum install -y certbot python3-certbot-nginx
  fi
fi

echo "Opening firewall (if firewalld is running)..."
if systemctl is-active --quiet firewalld; then
  firewall-cmd --permanent --add-service=http || true
  firewall-cmd --permanent --add-service=https || true
  firewall-cmd --reload || true
fi

echo "Creating webroot for ACME challenges..."
mkdir -p /var/www/certbot
chown -R www-data:www-data /var/www/certbot 2>/dev/null || true

echo "Writing Nginx site config..."
install -d -m 0755 /etc/nginx/sites-available /etc/nginx/sites-enabled 2>/dev/null || true
install -m 0644 "$(dirname "$0")/nginx-webpage.conf" \
  /etc/nginx/sites-available/webpage.conf 2>/dev/null || cp -f "$(dirname "$0")/nginx-webpage.conf" /etc/nginx/conf.d/webpage.conf
if [[ -d /etc/nginx/sites-enabled ]]; then
  ln -sf /etc/nginx/sites-available/webpage.conf /etc/nginx/sites-enabled/webpage.conf
fi

echo "Testing Nginx config..."
nginx -t

echo "Enabling and starting Nginx..."
systemctl enable --now nginx

echo "Obtaining Let's Encrypt certificate for $DOMAIN ..."
certbot certonly --webroot -w /var/www/certbot -d "$DOMAIN" \
  --agree-tos -m "$EMAIL" --non-interactive --rsa-key-size 4096 --deploy-hook "systemctl reload nginx"

echo "Reloading Nginx with SSL..."
nginx -t && systemctl reload nginx

echo "Setting up automatic renewal..."
# Try systemd timers first
systemctl enable --now snap.certbot.renew.timer 2>/dev/null || true
systemctl enable --now certbot.timer 2>/dev/null || true

# Fallback to cron job if timers not available
if ! systemctl is-enabled certbot.timer >/dev/null 2>&1 && \
   ! systemctl is-enabled snap.certbot.renew.timer >/dev/null 2>&1; then
  echo "Installing cron job for renewal (twice daily)."
  cat >/etc/cron.d/webpage-certbot-renew <<'CRON'
SHELL=/bin/bash
PATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin
MAILTO=""
0 0,12 * * * root certbot renew --quiet --deploy-hook "systemctl reload nginx"
CRON
fi

echo "Done. Ensure your Node app listens on 127.0.0.1:3000 and is running (e.g., via PM2)."


