#!/usr/bin/env bash
# security-check.sh — Local HTML security audit for khancam.com
# Usage: bash scripts/security-check.sh [path/to/dir]  (defaults to current dir)

set -euo pipefail

DIR="${1:-.}"
PASS=0
FAIL=0
WARN=0

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

pass() { echo -e "${GREEN}[PASS]${NC} $1"; PASS=$((PASS + 1)); }
fail() { echo -e "${RED}[FAIL]${NC} $1"; FAIL=$((FAIL + 1)); }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; WARN=$((WARN + 1)); }

echo "================================================="
echo " khancam.com — Security Audit"
echo " Directory: $DIR"
echo "================================================="
echo ""

HTML_FILES=( "$DIR"/*.html )

# ── 1. CSP meta tag ──────────────────────────────────
echo "--- [1] Content Security Policy meta tag ---"
for file in "${HTML_FILES[@]}"; do
  name=$(basename "$file")
  if grep -q 'http-equiv="Content-Security-Policy"' "$file"; then
    pass "$name has CSP meta tag"
  else
    fail "$name is MISSING CSP meta tag"
  fi
done
echo ""

# ── 2. Referrer-Policy meta tag ───────────────────────
echo "--- [2] Referrer-Policy meta tag ---"
for file in "${HTML_FILES[@]}"; do
  name=$(basename "$file")
  if grep -q 'name="referrer"' "$file"; then
    pass "$name has referrer-policy meta tag"
  else
    fail "$name is MISSING referrer-policy meta tag"
  fi
done
echo ""

# ── 3. target=_blank missing rel ─────────────────────
echo "--- [3] target=_blank links must have rel=noopener noreferrer ---"
for file in "${HTML_FILES[@]}"; do
  name=$(basename "$file")
  ISSUES=$(grep -n 'target="_blank"' "$file" | grep -v 'rel="noopener noreferrer"' || true)
  if [ -n "$ISSUES" ]; then
    fail "$name has target=_blank without rel=noopener noreferrer:"
    echo "$ISSUES" | sed 's/^/       /'
  else
    pass "$name — all target=_blank links have rel=noopener noreferrer"
  fi
done
echo ""

# ── 4. Plain HTTP resource loads ─────────────────────
echo "--- [4] Insecure HTTP resource loads ---"
for file in "${HTML_FILES[@]}"; do
  name=$(basename "$file")
  ISSUES=$(grep -En 'src="http://|href="http://' "$file" || true)
  if [ -n "$ISSUES" ]; then
    fail "$name loads resources over plain HTTP:"
    echo "$ISSUES" | sed 's/^/       /'
  else
    pass "$name — no insecure HTTP resource loads"
  fi
done
echo ""

# ── 5. Inline event handlers ─────────────────────────
echo "--- [5] Inline event handlers (XSS risk) ---"
for file in "${HTML_FILES[@]}"; do
  name=$(basename "$file")
  ISSUES=$(grep -En ' on[a-z]+="' "$file" || true)
  if [ -n "$ISSUES" ]; then
    warn "$name has inline event handlers (consider moving to JS file):"
    echo "$ISSUES" | sed 's/^/       /'
  else
    pass "$name — no inline event handlers"
  fi
done
echo ""

# ── 6. _headers file ─────────────────────────────────
echo "--- [6] _headers file ---"
if [ -f "$DIR/_headers" ]; then
  pass "_headers file exists"
  REQUIRED_HEADERS=(
    "X-Frame-Options"
    "X-Content-Type-Options"
    "Referrer-Policy"
    "Content-Security-Policy"
    "Strict-Transport-Security"
    "Permissions-Policy"
  )
  for header in "${REQUIRED_HEADERS[@]}"; do
    if grep -q "$header" "$DIR/_headers"; then
      pass "  _headers contains $header"
    else
      fail "  _headers is MISSING $header"
    fi
  done
else
  fail "_headers file not found — HTTP security headers won't be applied"
fi
echo ""

# ── 7. HTML lang attribute ───────────────────────────
echo "--- [7] HTML lang attribute ---"
for file in "${HTML_FILES[@]}"; do
  name=$(basename "$file")
  if grep -q '<html lang=' "$file"; then
    pass "$name has lang attribute on <html>"
  else
    fail "$name is MISSING lang attribute on <html>"
  fi
done
echo ""

# ── Summary ──────────────────────────────────────────
echo "================================================="
echo " Summary"
echo "================================================="
echo -e " ${GREEN}PASS:${NC} $PASS"
echo -e " ${YELLOW}WARN:${NC} $WARN"
echo -e " ${RED}FAIL:${NC} $FAIL"
echo ""

if [ "$FAIL" -gt 0 ]; then
  echo -e "${RED}Audit FAILED — $FAIL issue(s) must be resolved.${NC}"
  exit 1
else
  echo -e "${GREEN}Audit PASSED${NC}"
  exit 0
fi
