#!/usr/bin/env bash
# Cloudflare setup and deploy for UIArchives. Run from the project root:
#
#   bash scripts/go-live.sh
#
# Re-run it any time — to deploy again, or to add a secret you skipped
# (it only asks about values that are still missing).
#
# A brand-new Worker must receive every declared secret in its first deploy,
# so all secrets live in .cloudflare-secrets (git-ignored, owner-only).
# Anything you skip is stored as "not-set", which the app treats as missing.
set -euo pipefail

WORKER=uiarchives
DB_NAME=uiarchives
SECRETS_FILE=.cloudflare-secrets
PLACEHOLDER=not-set

say() { printf "\n\033[1m%s\033[0m\n" "$*"; }

# ---------------------------------------------------------------- secrets
say "1/4  Secrets"
umask 077
touch "$SECRETS_FILE"

get() { grep -E "^$1=" "$SECRETS_FILE" | head -1 | cut -d= -f2- || true; }
set_kv() { # replace or append KEY=VALUE without echoing the value
  local tmp; tmp=$(mktemp)
  grep -vE "^$1=" "$SECRETS_FILE" > "$tmp" || true
  printf '%s=%s\n' "$1" "$2" >> "$tmp"
  mv "$tmp" "$SECRETS_FILE"
}

# Generated once, never change.
[ -n "$(get SESSION_SECRET)" ] || set_kv SESSION_SECRET "$(openssl rand -base64 48 | tr -d '\n=+/' )"
[ -n "$(get INGEST_TOKEN)" ]   || set_kv INGEST_TOKEN "$(openssl rand -hex 32)"
echo "  ✓ SESSION_SECRET, INGEST_TOKEN"

ask() { # name, prompt — only asks while the value is missing
  local name="$1" prompt="$2" cur value
  cur=$(get "$name")
  if [ -n "$cur" ] && [ "$cur" != "$PLACEHOLDER" ]; then echo "  ✓ $name"; return; fi
  # Non-interactive (CI, automation): keep what's there, don't prompt.
  if [ ! -t 0 ]; then [ -n "$cur" ] || set_kv "$name" "$PLACEHOLDER"; echo "  – $name not set (run interactively to add)"; return; fi
  read -r -s -p "  $prompt (Enter to skip): " value || value=""; echo
  if [ -n "$value" ]; then set_kv "$name" "$value"; echo "  ✓ $name"
  else set_kv "$name" "$PLACEHOLDER"; echo "  – $name skipped"; fi
}
ask ADMIN_EMAIL          "Your email (notifications + passkey sign-in codes)"
ask SMTP_USER            "Gmail address to send from"
ask SMTP_PASS            "Gmail app password (Google Account → Security → App passwords)"
ask GITHUB_TOKEN         "GitHub token for higher API limits (optional)"
ask TURNSTILE_SECRET_KEY "Cloudflare Turnstile secret (optional)"

# Deploy only the secrets the Worker declares (older keys may linger in the file).
DECLARED="ADMIN_EMAIL SESSION_SECRET INGEST_TOKEN SMTP_USER SMTP_PASS GITHUB_TOKEN TURNSTILE_SECRET_KEY"
DEPLOY_SECRETS=$(mktemp)
trap 'rm -f "$DEPLOY_SECRETS"' EXIT
for k in $DECLARED; do printf '%s=%s\n' "$k" "$(get "$k")" >> "$DEPLOY_SECRETS"; done

# ---------------------------------------------------------------- build + deploy
say "2/4  Building"
npm run build

say "3/4  Deploying"
npx cf deploy --prebuilt --secrets-file "$DEPLOY_SECRETS"

# ---------------------------------------------------------------- database
say "4/4  Database tables"
DB_ID=$(npx cf d1 list 2>/dev/null | node -e '
  let s = ""; process.stdin.on("data", d => s += d).on("end", () => {
    const list = JSON.parse(s.slice(s.indexOf("["), s.lastIndexOf("]") + 1));
    const db = list.find(d => d.name === process.argv[1]);
    if (!db) { console.error("D1 database not found"); process.exit(1); }
    process.stdout.write(db.uuid);
  });' "$DB_NAME")
npx cf d1 migrations apply "$DB_ID"

say "Done."
echo "Set up a passkey at /review — the code is emailed to ADMIN_EMAIL."
echo "Live at https://uiarchives.com"
echo "Skipped something? Re-run this script to add it."
