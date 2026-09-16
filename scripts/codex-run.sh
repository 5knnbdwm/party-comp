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

set -- --skip-git-repo-check -m "$model" -c "model_reasoning_effort=\"$effort\"" \
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
