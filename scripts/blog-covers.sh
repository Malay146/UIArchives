#!/usr/bin/env bash
# Captures every Journal post's cover as its share image and points the post at it.
#
#   npm run dev          # in another terminal (http://localhost:3001)
#   npm run covers       # or: bash scripts/blog-covers.sh [slug …]
#
# Writes public/blogs/<slug>.png (2400 × 1260, light theme) and sets
# `coverImage: "/blogs/<slug>.png"` in the post's frontmatter.
set -euo pipefail
cd "$(dirname "$0")/.."

BASE="${BASE:-http://localhost:3001}"
CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
curl -sf -o /dev/null "$BASE/" || { echo "Start the dev server first (npm run dev)."; exit 1; }
mkdir -p public/blogs

slugs=("$@")
if [ ${#slugs[@]} -eq 0 ]; then
  for f in content/blog/*.mdx; do slugs+=("$(basename "$f" .mdx)"); done
fi

for slug in "${slugs[@]}"; do
  file="content/blog/$slug.mdx"
  [ -f "$file" ] || { echo "  ✗ $slug (no such post)"; continue; }
  out="public/blogs/$slug.png"
  curl -sf -o /dev/null "$BASE/cover/$slug"   # warm up
  "$CHROME" --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=2 \
    --window-size=1200,630 --virtual-time-budget=8000 --screenshot="$out" "$BASE/cover/$slug" 2>/dev/null
  if grep -q '^coverImage:' "$file"; then
    sed -i '' "s#^coverImage:.*#coverImage: \"/blogs/$slug.png\"#" "$file"
  else
    awk -v line="coverImage: \"/blogs/$slug.png\"" 'NR==1{print;next} !done && /^---/{print line; done=1} {print}' "$file" > "$file.tmp" && mv "$file.tmp" "$file"
  fi
  echo "  ✓ $slug"
done
