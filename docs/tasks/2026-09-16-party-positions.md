# Task: coalition position, talks status and lead candidate for one party

You work on exactly one party, named in your prompt as `<state>/<party>`. Read `AGENTS.md` and `docs/archive-format.md` first, and `docs/project-brief.md` for context.

Today is 2026-09-16. Sachsen-Anhalt voted on 6 Sep 2026 and has no coalition yet. Berlin votes on 20 Sep 2026.

## What to establish

1. **`coalition_position`**: what the party has said about which coalitions it seeks, accepts or rules out.
   - Sachsen-Anhalt: statements since election day, 6 Sep 2026. Add earlier statements only if the party has said nothing since.
   - Berlin: the latest statements before the election.
   - The value is `{stated_on, speaker, speaker_role, summary}` as defined in `docs/archive-format.md`. The summary stays close to the wording, such as "Schließt eine Zusammenarbeit mit der AfD aus; offen für Gespräche mit CDU und SPD", and carries no date. The quote is the exact sentence or sentences it rests on.
   - One fact per distinct statement. When the position shifted over time, record each dated statement.
2. **`sondierung_status`**, Sachsen-Anhalt only: who the party is holding or has held exploratory or coalition talks with, as of today. Also record when the party has been invited, has declined, or talks have ended.
3. **`lead_candidate`**, only if the party file has none: the party's lead candidate or candidates for this election.

## Where to look

Start with what is already captured. `archive/tracked-urls.json` lists this party's URLs, including any `coalition_statement` captures. Read their text files, and for HTML also the raw blob.

Then look for newer or missing statements on:
- The state party site: news, press releases, "Aktuelles", "Presse".
- The parliamentary group site, if the party has one: press releases.
- The lead candidate's page on the party site.

Navigation links are in the raw HTML blobs. The text files drop headers, footers and navigation.

Official party and parliamentary group pages come first. Use press articles, with `publisher_type: "press"`, only for what no official page states, such as talks the party has not announced itself.

Add every page you read to `archive/tracked-urls.json`, with a fitting `kind` such as `coalition_statement`, `press_release`, `lead_candidate_page` or `other`. Capture it with `bun scripts/archive-fetch.ts --url <url>`, adding `--wayback` for coalition statements. Only then cite it.

## Done when

- Each of the items above that applies to this party has at least one fact, or a gap whose `searched` list names every captured page you read for it. Aim for at least five relevant pages before you record a gap for `coalition_position`. A party that has made statements almost always has them on its news or press page.
- `bun scripts/archive-validate.ts` passes.
- You appended a section `## <state>/<party>` to `docs/reports/2026-09-16-party-positions.md`, creating the file if needed. It lists each fact you added with its date and source URL, each gap with the pages searched, and anything unclear or contradictory.

## Rules

- Only this party's file in `data/parties/`, plus `archive/tracked-urls.json` and the report. Leave other parties' files unchanged.
- Quotes are copied exactly from the capture's text, OCR text or raw HTML.
- Only `scripts/archive-fetch.ts` writes captures.
- Keep the report as Markdown in `docs/reports/`. Upload nothing anywhere: no Postplan, no gists, no pastebins. The only allowed external write is the Wayback request the fetch script makes.
- Do not log in, post or submit forms. Do not fetch social media sites.
- Scratch files go in `tmp/`. Leave git alone.
