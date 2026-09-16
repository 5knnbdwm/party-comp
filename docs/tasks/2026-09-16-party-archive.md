# Task: archive all parties in Sachsen-Anhalt and Berlin

Read `AGENTS.md`, `docs/project-brief.md` and `docs/archive-format.md` first. The archive format is the contract for everything you write.

## Context

Today is 2026-09-16. Sachsen-Anhalt held its Landtag election on 6 Sep 2026 and has not formed a coalition yet. Berlin elects its Abgeordnetenhaus on 20 Sep 2026. Any party could end up in government, so we need the full record of every party admitted to the ballot in both states, captured now, with sources. Parties may later edit or delete their programs and statements. The archive must let us prove what they published and when.

## Steps

### 1. Fetch script

Write `scripts/archive-fetch.ts` for Bun, in TypeScript, using no dependencies unless one clearly saves effort. It implements the "Captures" and "Re-fetching" sections of the archive format.

- Default: fetch every URL in `archive/tracked-urls.json`.
- `--url <url>`: fetch only that tracked URL.
- `--wayback`: also request a Save Page Now snapshot at `https://web.archive.org/save/<url>`, and record the snapshot URL, or `null` on failure. Failure must not stop the run.
- Extract text with `pdftotext -layout` and PDF metadata with `pdfinfo`, both installed. For HTML, extract the readable main text.
- Send a descriptive User-Agent such as `party-promise-tracker-archiver/0.1`, and make at most one request per second per host.

Also write `scripts/archive-validate.ts`. It checks that every fact source names an existing capture, every capture's blob exists and matches its `sha256`, every tracked URL has at least one capture, and every file matches the format. It exits non-zero on any problem.

Done when both scripts run, and fetching the same URL twice produces a second capture with `content_changed: false` and no duplicate blob.

### 2. Admitted parties

For each state, find the official list of parties admitted to the election. It comes from the Landeswahlleiter or Landeswahlausschuss. Track and capture it, then create one party file per admitted party with `name_full`, `name_short`, `ballot_admitted` and `ballot_list_number`.

Done when the number of party files per state equals the number of parties on the captured official list.

### 3. Every party's record

For every admitted party in both states, look for each of the following. Track and capture every URL that backs a fact.

- Party website: the state association (Landesverband) and the federal party site.
- Parliamentary group website, if the party sits in the current parliament.
- Every election program document for this election: full, short, easy language, HTML version, points or priorities lists such as a "100 Punkte" paper, and immediate-action programs.
- Lead candidates.
- Official social accounts of the state party, the parliamentary group and the lead candidates, on X, Instagram, Facebook, TikTok, Bluesky and YouTube. Record only the profile URL as a fact, sourced from the capture of an official page that links it. Do not scrape social media content.
- Whether the party sat in parliament before the election, with seat count.

Work through the parties from largest to smallest. Small parties often have no state program. Record that as a gap listing the pages you checked. Run fetches with `--wayback` for program documents.

Done when every party file has a fact or a gap for each item above.

### 4. Election results and coalition talks

Sachsen-Anhalt:
- Capture the official result from the Landeswahlleiterin, marked preliminary or final, and add `election_result` for each party.
- For every party that won seats, capture its official statements on coalitions and exploratory talks since election day, from the party site, parliamentary group site and press releases. Add `coalition_position` and `sondierung_status` facts.
- Use press articles only when no official statement exists, with `publisher_type: "press"`.
- Capture any Sondierungspapier that has been published.

Berlin:
- Capture each party's published coalition statements from before the election, as `coalition_position`.
- Record `election_result` as a gap, since the election is on 20 Sep.

Done when every Sachsen-Anhalt party with seats has an election result, a coalition position and a talks status, each as a fact or a gap.

### 5. Validate and report

Run `bun scripts/archive-validate.ts` until it passes.

Write `docs/reports/2026-09-16-party-archive.md` with:
- A table per state: party, admitted, program documents found, lead candidates, social accounts found, gaps.
- Every fetch that failed, and every page that needs a browser or login you could not get past.
- Every fact where the sources disagree or you were unsure.
- Anything the archive format could not represent well.

Done when the validator passes and the report covers every party.

## Rules

- Every fact in `data/` cites a capture with a verbatim quote. When you cannot capture a source, write a gap instead of a fact.
- Prefer official sources: election authorities, parliaments, party and parliamentary group sites. Use search engines and news only to discover URLs.
- Record page content exactly as fetched. Keep the German text in quotes and values.
- Only `https://web.archive.org/save/` receives requests that create something. Do not log in, post or submit forms anywhere.
- Leave `docs/project-brief.md` unchanged. You may extend `docs/archive-format.md` with new `kind` values or fact keys, documented in its tables in the same change.
- Keep going through all parties in both states. If you run out of time, the report says exactly which parties and items remain.
