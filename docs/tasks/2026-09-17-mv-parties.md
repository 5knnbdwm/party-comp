# Task: Mecklenburg-Vorpommern parties, basic records and core list

Read `AGENTS.md`, `docs/project-brief.md` ("Core parties") and `docs/archive-format.md` first.

Today is 2026-09-17. Mecklenburg-Vorpommern elects its Landtag on 20 Sep 2026. Sachsen-Anhalt and Berlin are already archived under `data/parties/`. Their files show what a finished record looks like. Use state slug `mecklenburg-vorpommern`.

## Steps

### 1. Admitted parties

Find the official list of parties admitted with a Landesliste for this election, from the Landeswahlleiterin or Landeswahlausschuss Mecklenburg-Vorpommern. Track and capture it. If it is a scanned PDF, the fetch script writes OCR text to `archive/ocr/`; quote from there.

Create one party file per admitted party with `name_full`, `name_short`, `ballot_admitted` and `ballot_list_number`. Add `ballot_scope` where the list distinguishes list and constituency-only admission.

Done when the number of party files equals the number of parties on the captured list, and every quote shows its value.

### 2. Outgoing Landtag

Capture an official page of the Landtag Mecklenburg-Vorpommern that shows the current parliamentary groups and their seats. Add `in_parliament_before_election` for every admitted party and `seats_before_election` for every party with seats.

Done when every party file has `in_parliament_before_election`.

### 3. Core list

Capture the Mecklenburg-Vorpommern poll page on wahlrecht.de with `publisher_type: "press"` and kind `other`. Apply the rule from the brief: parties in the outgoing Landtag, plus any party at 3% or more in the latest poll of at least two institutes.

Add `"mecklenburg-vorpommern": [...]` with the core party slugs to `data/core-parties.json`, keeping the existing entries.

Done when the core list is final, backed by captures, and written to `data/core-parties.json`.

### 4. Core party websites

For each core party, find and capture the state association website and the parliamentary group website if it has one. Add `state_association_website`, `website` for the federal party, and `parliamentary_group_website`. Links to these sites often sit only in the raw HTML navigation, so search the blobs, not only the text files.

Done when every core party has these facts, or gaps whose searched pages are captured.

### 5. Report

Write `docs/reports/2026-09-17-mv-parties.md`:
- The admitted parties with list numbers.
- The core list and the polls behind it.
- A table of core parties with website, parliamentary group site and seats before the election.
- Failed fetches, each listed once.

Done when `bun scripts/archive-validate.ts` passes and the report covers every admitted party.

## Rules

- Every fact cites a capture with an exact quote. Only `scripts/archive-fetch.ts` writes captures. Use `--wayback` for the admission list.
- Change only Mecklenburg-Vorpommern party files, `data/core-parties.json`, `archive/tracked-urls.json`, `docs/archive-format.md` if you add a kind or key, and the report.
- Programs, lead candidates, social accounts and coalition positions come in a separate per-party run. Leave them out here.
- Keep the report as Markdown in `docs/reports/`. Upload nothing anywhere: no Postplan, no gists, no pastebins. The only allowed external write is the Wayback request the fetch script makes.
- Do not log in, post or submit forms. Do not fetch social media sites.
- Scratch files go in `tmp/`. Leave git alone.
