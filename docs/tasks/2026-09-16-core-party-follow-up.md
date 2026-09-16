# Task: fix validation errors and complete the core parties

Read `AGENTS.md`, `docs/project-brief.md` (especially "Core parties") and `docs/archive-format.md` first. The validator got stricter since the first pass: quotes must show the fact's value, scanned PDFs are checked against OCR text, and every gap must list captured pages it searched.

## Context

Today is 2026-09-16. A first archive pass created files for all admitted parties. It left lead candidates, social accounts, parliamentary group websites and coalition statements empty for every party. Empty gaps that recorded no search have been removed, so a missing fact or gap now means "not checked yet".

Core parties:
- Sachsen-Anhalt, parties that won seats: `afd`, `cdu`, `spd`, `linke`, `gruene`, `bsw`.
- Berlin: `cdu`, `spd`, `gruene`, `linke`, `afd`, plus parties that qualify by the poll rule in the brief.

## Steps

### 1. Fix every validator error

Run `bun scripts/archive-validate.ts`. Fix every error, for all parties, not only core parties:
- Replace quotes that do not show the value with a quote that does, from the same or a better capture.
- The Sachsen-Anhalt admission list and the AfD "100-Tage-Sofortprogramm" and "Kernpunkte" PDFs are scans. Copy quotes from `archive/ocr/<sha256>.txt` exactly as OCR spelled them.
- For election results, quote the readable result table text or the embedded data that contains the numbers.
- Delete a fact that no capture supports. Git keeps the old version.

Done when the validator passes.

### 2. Decide Berlin's poll-qualified parties

Track and capture the Berlin poll page on wahlrecht.de, with `publisher_type: "press"` and kind `other`. Apply the rule from the brief. List the qualifying parties and the polls behind the decision in the report.

Done when the Berlin core list is final and backed by a capture.

### 3. Complete every core party

For each core party in both states, make sure each item below has a fact, or a gap whose `searched` pages are all tracked and captured:

- `state_association_website` and `website`.
- `parliamentary_group_website`, for parties in the outgoing parliament.
- `lead_candidate`, from the party's own site or the official candidate list.
- `social_account` for the state party, parliamentary group and lead candidates, on X, Instagram, Facebook, TikTok, Bluesky and YouTube. Take profile URLs from links on official pages. Record the page that links the profile as the source. Do not fetch social media sites.
- `program` for every program document: full, short, easy language, HTML, points lists, immediate-action programs. Add `program` facts for the AfD Sachsen-Anhalt "100-Tage-Sofortprogramm" and "Kernpunkte" PDFs, which are tracked but not yet recorded as facts.
- `coalition_position`: Sachsen-Anhalt since election day, Berlin before the election. Prefer statements on the party or parliamentary group site. Use press only when no official statement exists.
- `sondierung_status`, Sachsen-Anhalt only: who is talking to whom, as of today.

Add URLs to `archive/tracked-urls.json`, then capture them with `bun scripts/archive-fetch.ts --url <url>`. Use `--wayback` for program documents and coalition statements. Record a gap only after you have captured the pages you checked.

Done when every core party has a fact or a searched gap for every item, and the validator passes.

### 4. Report

Write `docs/reports/2026-09-16-core-party-follow-up.md`:
- The Berlin core list and how the poll rule decided it.
- A table per state with one row per core party: lead candidates, parliamentary group site, social accounts found, program documents, coalition position, talks status. Mark each cell found or gap.
- Facts you deleted or whose value you changed in step 1, with the reason.
- Every coalition position or talks status where sources conflict or you were unsure.
- Failed fetches, each listed once.

Done when the report covers every core party and the validator passes.

## Rules

- Every quote is copied exactly from its capture's text, OCR text or raw HTML.
- Only `scripts/archive-fetch.ts` writes to `archive/captures.jsonl`, `archive/blobs`, `archive/text` and `archive/ocr`.
- Only `https://web.archive.org/save/` receives requests that create something. Do not log in, post or submit forms anywhere.
- Scratch files go in `tmp/`. Leave git alone. Your changes get reviewed and committed afterwards.
- Leave `docs/project-brief.md` unchanged. You may extend `docs/archive-format.md` with new `kind` values or fact keys, documented in the same change.
- Non-core parties get only step 1 fixes and no new research.
