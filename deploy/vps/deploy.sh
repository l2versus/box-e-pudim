#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/box-e-pudim}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"
git pull --ff-only origin "$BRANCH"

npm ci
npm run build

cd "$APP_DIR/server"
npm ci
npx prisma generate
npx prisma migrate deploy

systemctl restart box-e-pudim-api.service
nginx -t
systemctl reload nginx
