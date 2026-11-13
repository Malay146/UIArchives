#!/usr/bin/env bash
# Tells IndexNow search engines (Bing — which powers ChatGPT search — Yandex,
# Seznam, Naver…) about every URL in the live sitemap, so new and changed
# pages are crawled within hours instead of weeks. Run after a deploy:
#
#   bash scripts/indexnow.sh
set -euo pipefail
cd "$(dirname "$0")/.."
HOST="uiarchives.com"
KEY_FILE=$(ls public/*.txt | xargs -n1 basename | grep -E '^[a-f0-9]{32}\.txt$' | head -1)
KEY="${KEY_FILE%.txt}"
[ -n "$KEY" ] || { echo "No IndexNow key file in public/"; exit 1; }

URLS=$(curl -sf "https://$HOST/sitemap.xml" | grep -oE '<loc>[^<]+</loc>' | sed -E 's#</?loc>##g')
COUNT=$(printf '%s\n' "$URLS" | grep -c .)
JSON=$(printf '%s\n' "$URLS" | node -e '
  let s=""; process.stdin.on("data",d=>s+=d).on("end",()=>{
    const urlList=s.split("\n").filter(Boolean);
    process.stdout.write(JSON.stringify({host:process.argv[1],key:process.argv[2],keyLocation:`https://${process.argv[1]}/${process.argv[2]}.txt`,urlList}));
  });' "$HOST" "$KEY")

CODE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "https://api.indexnow.org/indexnow" \
  -H "content-type: application/json; charset=utf-8" -d "$JSON")
echo "IndexNow: submitted $COUNT URLs (HTTP $CODE — 200/202 means accepted)"
