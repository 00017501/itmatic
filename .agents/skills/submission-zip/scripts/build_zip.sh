#!/usr/bin/env bash
# Build the CW2 submission zip (README, prototypes, video, AI usage record) and check it after unzipping.
# Usage: build_zip.sh <student-id> [path-to-video]
set -uo pipefail

ID="${1:-}"
if [ -z "$ID" ]; then
  echo "usage: build_zip.sh <student-id> [path-to-video]" >&2
  exit 2
fi

ROOT="$(cd "$(dirname "$0")/../../../.." && pwd)"
VIDEO="${2:-$ROOT/submission/screencast.mp4}"
NAME="SAD_CW2_${ID}"
OUT_DIR="${CW2_OUT_DIR:-$ROOT/submission}"   # override only for dry runs
ZIP="$OUT_DIR/$NAME.zip"

STAGE="$(mktemp -d)"
CHECK="$(mktemp -d)"
trap 'rm -rf "$STAGE" "$CHECK"' EXIT

FAILED=0
pass() { echo "PASS  $1"; }
fail() { echo "FAIL  $1"; FAILED=1; }
note() { echo "NOTE  $1"; }

# --- stage: only README, prototypes, the video and the AI usage record ----
[ -f "$ROOT/README.md" ] && cp "$ROOT/README.md" "$STAGE/"
if [ -f "$ROOT/ai-usage/prompts.md" ]; then
  mkdir -p "$STAGE/ai-usage"
  cp "$ROOT/ai-usage/prompts.md" "$STAGE/ai-usage/"
fi
if [ -d "$ROOT/prototypes" ]; then
  rsync -a \
    --exclude 'node_modules' --exclude 'dist' --exclude '.git' \
    --exclude '.env' --exclude '.env.*' --exclude '.vite' --exclude '.DS_Store' \
    --exclude '.eslintcache' --exclude '.vscode' \
    --exclude 'auto-imports.d.ts' --exclude 'components.d.ts' \
    "$ROOT/prototypes" "$STAGE/"
fi
VIDEO_NAME=""
if [ -f "$VIDEO" ]; then
  VIDEO_NAME="screencast.${VIDEO##*.}"
  cp "$VIDEO" "$STAGE/$VIDEO_NAME"
fi

# --- zip -------------------------------------------------------------------
mkdir -p "$OUT_DIR"
TMP_ZIP="$STAGE/../$NAME.$$.zip"
(cd "$STAGE" && zip -q -r -X "$TMP_ZIP" . -x '*.DS_Store') || { echo "FAIL  zip could not be created"; exit 1; }
mv -f "$TMP_ZIP" "$ZIP"

# --- check the zip itself, not the staging folder ---------------------------
unzip -q "$ZIP" -d "$CHECK" || { echo "FAIL  zip could not be unzipped"; exit 1; }

echo "== Checks on the unzipped $NAME.zip =="

[ -f "$CHECK/README.md" ] && pass "README.md at the zip root" || fail "README.md missing at the zip root"

if [ -f "$CHECK/prototypes/high-fi/package.json" ] && [ -n "$(ls -A "$CHECK/prototypes/high-fi/src" 2>/dev/null)" ]; then
  pass "high-fi source code present (prototypes/high-fi)"
else
  fail "high-fi source code missing (prototypes/high-fi/package.json and src/)  -> brief P-03, -35"
fi

if [ -n "$(find "$CHECK/prototypes/low-fi" -type f 2>/dev/null | head -1)" ]; then
  pass "low-fi files present (prototypes/low-fi)"
else
  fail "low-fi files missing (prototypes/low-fi is empty)"
fi

if [ -f "$CHECK/ai-usage/prompts.md" ]; then
  pass "AI usage record present (ai-usage/prompts.md)"
else
  fail "AI usage record missing (ai-usage/prompts.md)  -> brief U-04"
fi

if [ -n "$VIDEO_NAME" ] && [ -f "$CHECK/$VIDEO_NAME" ]; then
  pass "video at the zip root ($VIDEO_NAME)"
  if command -v ffprobe >/dev/null 2>&1; then
    SECS="$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$CHECK/$VIDEO_NAME" 2>/dev/null)"
    if [ -z "$SECS" ]; then
      fail "video length could not be read"
    elif awk "BEGIN{exit !($SECS <= 60.0)}"; then
      pass "video length ${SECS}s (maximum 60)"
    else
      fail "video length ${SECS}s is over 60  -> brief B-04"
    fi
  else
    note "video length NOT checked: ffprobe is not installed"
  fi
else
  fail "video missing (looked for $VIDEO)  -> brief P-02, -35 and non-submission"
fi

FORBIDDEN="$(cd "$CHECK" && find . \
  \( -name 'AGENTS.md' -o -name 'CLAUDE.md' -o -name 'DESIGN.md' -o -name 'PRODUCT.md' \
     -o -name '.agents' -o -name '.claude' -o -name '.codex' -o -name '.impeccable' \
     -o -name 'node_modules' -o -name 'dist' -o -name '.git' \
     -o -name '.env' -o -name '.env.*' -o -path './context' \) -print 2>/dev/null)"
if [ -z "$FORBIDDEN" ]; then
  pass "no harness, context, node_modules, dist, .git or .env files inside"
else
  fail "files that must not be in the zip:"
  echo "$FORBIDDEN" | sed 's/^/        /'
fi

echo
echo "== Top level of the zip =="
ls -1A "$CHECK"
echo
echo "Zip: $ZIP ($(du -h "$ZIP" | cut -f1), $(find "$CHECK" -type f | wc -l | tr -d ' ') files)"

if [ "$FAILED" -ne 0 ]; then
  echo "RESULT: NOT READY - fix the FAIL lines above and run again."
  exit 1
fi
echo "RESULT: READY"
