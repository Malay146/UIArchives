#!/usr/bin/env bash
# Copies uiarchives.com's mail records from GoDaddy DNS into the Cloudflare
# zone, so GoDaddy email keeps working after the nameservers move.
# Web traffic (@ and www) is attached to the Worker separately on deploy.
#
#   bash scripts/dns-records.sh
set -euo pipefail
ZONE=uiarchives.com

add() {
  npx cf dns records create -z "${ZONE}" --body "$1" >/dev/null && echo "  ✓ $2"
}

echo "Adding mail records to Cloudflare DNS for ${ZONE}…"
add '{"type":"MX","name":"uiarchives.com","content":"smtp.secureserver.net","priority":0,"ttl":3600}'        "MX 0  smtp.secureserver.net"
add '{"type":"MX","name":"uiarchives.com","content":"mailstore1.secureserver.net","priority":10,"ttl":3600}' "MX 10 mailstore1.secureserver.net"
add '{"type":"TXT","name":"uiarchives.com","content":"\"v=spf1 include:spf.em.secureserver.net ?all\"","ttl":3600}' "TXT SPF"
add '{"type":"TXT","name":"_dmarc.uiarchives.com","content":"\"v=DMARC1; p=quarantine; adkim=r; aspf=r; rua=mailto:dmarc_rua@onsecureserver.net;\"","ttl":3600}' "TXT DMARC"

cat <<'EOF'

Done. Now switch the nameservers at GoDaddy:
  GoDaddy → My Products → uiarchives.com → DNS → Nameservers → Change
  → "I'll use my own nameservers":
      anita.ns.cloudflare.com
      greg.ns.cloudflare.com
Then tell Claude — it attaches uiarchives.com and www to the site.
EOF
