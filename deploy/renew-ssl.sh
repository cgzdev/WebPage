#!/usr/bin/env bash
set -euo pipefail

echo "Running certbot renew..."
certbot renew --quiet --deploy-hook "systemctl reload nginx"


