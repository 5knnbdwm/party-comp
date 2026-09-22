#!/bin/sh
# Runs a Codex session with all of its files kept inside this project.
#
#   scripts/codex-run.sh <run-name> "<prompt>"                   start a new session
#   scripts/codex-run.sh <run-name> "<prompt>" <session-id>      resume a session
#
# Writes runs/<run-name>.log, runs/<run-name>.last-message.md and a copy of the
# session transcript at runs/<run-name>.transcript.jsonl. Scratch files go to tmp/.
# Effort defaults to medium; override with CODEX_EFFORT=low. The model defaults to
# gpt-5.6-terra; override with CODEX_MODEL=gpt-5.6-luna or another Codex model.
set -eu

root=$(cd "$(dirname "$0")/.." && pwd)
name=$1
prompt=$2
session=${3:-}
effort=${CODEX_EFFORT:-medium}
model=${CODEX_MODEL:-gpt-5.6-terra}

mkdir -p "$root/runs" "$root/tmp"
log="$root/runs/$name.log"
export TMPDIR="$root/tmp"

# Requests go through the local CLIProxyAPI rather than a ChatGPT login, which is what the
# desktop app uses too. The key is read from the proxy's own config unless it is already set.
: "${CLIPROXY_BASE_URL:=http://127.0.0.1:8317/v1}"
: "${CLIPROXY_CONFIG:=/opt/homebrew/etc/cliproxyapi.conf}"
if [ -z "${CLIPROXY_API_KEY:-}" ] && [ -r "$CLIPROXY_CONFIG" ]; then
  CLIPROXY_API_KEY=$(awk '/^api-keys:/{f=1;next} f&&/^[[:space:]]*-/{gsub(/^[[:space:]]*-[[:space:]]*"?|"?[[:space:]]*$/,"");print;exit} f&&/^[^[:space:]#-]/{exit}' "$CLIPROXY_CONFIG")
fi
export CLIPROXY_API_KEY

set -- --skip-git-repo-check -m "$model" -c "model_reasoning_effort=\"$effort\"" \
  -c "model_provider=\"cliproxyapi\"" \
  -c "model_providers.cliproxyapi.name=\"CLIProxyAPI\"" \
  -c "model_providers.cliproxyapi.base_url=\"$CLIPROXY_BASE_URL\"" \
  -c "model_providers.cliproxyapi.wire_api=\"responses\"" \
  -c "model_providers.cliproxyapi.env_key=\"CLIPROXY_API_KEY\"" \
  -c "model_providers.cliproxyapi.requires_openai_auth=false" \
  -o "$root/runs/$name.last-message.md"

cd "$root"
status=0
if [ -n "$session" ]; then
  codex exec resume "$session" "$@" "$prompt" < /dev/null >> "$log" 2>&1 || status=$?
else
  codex exec -C "$root" "$@" "$prompt" < /dev/null >> "$log" 2>&1 || status=$?
  session=$(sed -n 's/^session id: //p' "$log" | tail -1)
fi

# Codex stores transcripts under ~/.codex/sessions; keep a copy with the run.
transcript=$(find "$HOME/.codex/sessions" -name "*$session.jsonl" 2>/dev/null | head -1)
[ -n "$transcript" ] && cp "$transcript" "$root/runs/$name.transcript.jsonl"

echo "exit=$status session=$session"
exit "$status"
