#!/bin/sh
set -eu

node --input-type=module <<'JS'
const { APP_URL, DATABASE_URL, RATE_LIMIT_SALT } = process.env;
const url = URL.parse(APP_URL ?? "");
if (!url || url.protocol !== "https:" || url.origin !== APP_URL) {
  throw new Error("APP_URL must be an HTTPS origin without a trailing slash.");
}
if (!DATABASE_URL) {
  throw new Error("Configure DATABASE_URL.");
}
if (!RATE_LIMIT_SALT || RATE_LIMIT_SALT.trim().length < 32) {
  throw new Error("Configure RATE_LIMIT_SALT with at least 32 random characters.");
}
JS

npm run db:migrate
exec node node_modules/next/dist/bin/next start --hostname 0.0.0.0 --port 3000
