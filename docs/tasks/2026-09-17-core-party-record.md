# Task: complete one core party's record

You work on exactly one party, named in your prompt as `<state>/<party>`. Read `AGENTS.md` and `docs/archive-format.md` first, and `docs/project-brief.md` for context.

Today is 2026-09-17. The party's file already has its name, ballot position, seats before the election and websites. `data/parties/berlin/spd.json` and `data/parties/sachsen-anhalt/cdu.json` show what a finished record looks like.

## What to establish

1. **`program`**: every program document for this election. Full program, short program, easy language version, HTML version, points or priorities lists, immediate-action programs. One fact per document. Track each with its `kind`, and capture program documents with `--wayback`.
2. **`lead_candidate`**: the party's lead candidate or candidates, from the party's own site. Track and capture the candidate's page on the party site as `lead_candidate_page`, if one exists.
3. **`coalition_position`**: the latest statements before the election on which coalitions the party seeks, accepts or rules out. The value is `{stated_on, speaker, speaker_role, summary}`, as defined in `docs/archive-format.md`. A lead candidate's interview is that person's statement, so record the person as `speaker`. One fact per distinct statement.

## Where to look

- The state party site and the parliamentary group site, already captured. Their navigation links, such as "Programm", "Wahl 2026", "Presse", "Aktuelles" and "Team", are in the raw HTML blobs; the text files drop navigation.
- Press releases and news pages on those sites.
- Press interviews and reports, with `publisher_type: "press"`, for coalition statements no official page makes.

Capture every page you read with `bun scripts/archive-fetch.ts --url <url>` after adding it to `archive/tracked-urls.json`. Only then cite it.

## Done when

- Each of the three items has at least one fact, or a gap whose `searched` list names every captured page you read for it. Read at least five relevant pages, including the party's news or press page, before recording a gap for `coalition_position`.
- `bun scripts/extract-social-accounts.ts` has run after your captures.
- `bun scripts/archive-validate.ts` passes.
- You appended a section `## <state>/<party>` to `docs/reports/2026-09-17-core-party-records.md`, creating the file if needed. It lists each fact with its date and source URL, each gap with the pages searched, and anything unclear.

## Rules

- Change only this party's file, `archive/tracked-urls.json` and the report. `extract-social-accounts.ts` may add facts to this party's file.
- Quotes are copied exactly from the capture's text, OCR text or raw HTML.
- Only `scripts/archive-fetch.ts` writes captures.
- Keep the report as Markdown in `docs/reports/`. Upload nothing anywhere: no Postplan, no gists, no pastebins. The only allowed external write is the Wayback request the fetch script makes.
- Do not log in, post or submit forms. Do not fetch social media sites.
- Scratch files go in `tmp/`. Leave git alone.
