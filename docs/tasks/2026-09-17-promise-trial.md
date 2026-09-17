# Task: trace five coalition promises from the previous term

Read `AGENTS.md`, `docs/project-brief.md` ("Core model", "Sources") and `docs/archive-format.md` first.

This is the Phase 1 trial from the brief. Its purpose is to test the method before the website exists: whether promises can be selected, given a done-when and traced to a status with evidence, and where the draft model breaks. Your report on what was hard matters as much as the statuses.

Your prompt names a state, a mode and your model name:

| State | Previous term | Governing parties |
|---|---|---|
| `sachsen-anhalt` | 2021–2026 | CDU, SPD, FDP |
| `berlin` | 2023–2026 | CDU, SPD |
| `mecklenburg-vorpommern` | 2021–2026 | SPD, Die Linke |

Confirm the governing parties and the term dates from the captured coalition agreement. Today is 2026-09-17.

## Modes

- **`select`**: you choose the five promises and trace them.
- **`trace`**: another model already chose them. Read `data/trial/<state>/selection.json` and trace exactly those five, without looking at the other model's trace file or report. Write your own done-when and status. The comparison between the two traces is the point.

## Steps

### 1. Sources for the promises

Mode `select`:
- Find, track and capture the coalition agreement of the previous term, with kind `coalition_agreement` and `--wayback`.
- Find, track and capture the election programs of the governing parties for that election. Use kind `program_full` and the party slug.

Mode `trace`: these are already captured. Their captures are named in `selection.json`.

### 2. Select five promises (mode `select` only)

Choose five commitments from the coalition agreement, one of each kind:

1. A measurable target with a number.
2. A commitment that needs a law.
3. A commitment that depends on budget money.
4. A vague or aspirational commitment.
5. A commitment that touches federal or EU competence.

Prefer commitments that were publicly discussed during the term, from five different topics.

Write `data/trial/<state>/selection.json`:

```json
{
  "state": "berlin",
  "coalition_agreement_capture": "cap_…",
  "promises": [
    { "id": "berlin-1", "kind": "measurable", "quote": "exact text", "capture": "cap_…", "page": 12 }
  ]
}
```

`kind` is one of `measurable`, `law`, `budget`, `vague`, `federal`.

### 3. Trace each promise

For each promise, build the record the brief describes:

- **Program sources**: the matching promise in each governing party's program, quoted with page, or a note that no program contains it.
- **Adoption**: `adopted`, `weakened`, `changed`, or `not_in_programs` when the commitment appears in no program.
- **Topic**, **competence** (`state`, `federal`, `eu`, `municipal` or `mixed`) and **deadline**, if one is named.
- **Done-when**: a concrete completion test, or `null` with status `not_assessable` if the commitment is too vague. Never invent a measurable version of a vague commitment.
- **Events**: every relevant step during the term, with date, type and sources. Search in this order:
  1. The parliament's documentation system: Drucksachen, bills, Plenarprotokolle, and Kleine and Große Anfragen with the government's answers. Answers to written questions often state a project's status directly.
  2. The state budget: Haushaltspläne and supplementary budgets.
  3. The official gazette: Gesetz- und Verordnungsblatt.
  4. Government and ministry press releases and reports.
  5. Official statistics, for measurable targets.
  6. Press, only for what official sources do not show.
- **Status**, using exactly the vocabulary in the brief, with reasoning against the done-when.
- **Open questions**: what you could not settle, and why.

Capture every document you cite. Add it to `archive/tracked-urls.json` with `party: null` unless it belongs to one party, a fitting kind such as `drucksache`, `plenary_protocol`, `budget`, `gazette`, `government_statement` or `statistic`, and `publisher_type` `parliament` or `government` where that fits. Then run `bun scripts/archive-fetch.ts --url <url>`.

Write `data/trial/<state>/<your-model>.json`:

```json
{
  "state": "berlin",
  "mode": "select",
  "model": "gpt-5.6-sol",
  "traced_at": "2026-09-17T12:00:00Z",
  "promises": [
    {
      "id": "berlin-1",
      "program_sources": [ { "party": "spd", "quote": "…", "capture": "cap_…", "page": 31 } ],
      "adoption": "weakened",
      "topic": "housing",
      "competence": "state",
      "deadline": "2026",
      "done_when": "…",
      "events": [
        { "date": "2024-03-12", "type": "bill_introduced", "summary": "…", "sources": [ { "capture": "cap_…", "quote": "…", "page": 1 } ] }
      ],
      "status": "proposed",
      "status_reasoning": "…",
      "open_questions": [ "…" ]
    }
  ]
}
```

Event `type` is one of `announcement`, `cabinet_decision`, `bill_introduced`, `law_passed`, `regulation_issued`, `budget_line`, `government_answer`, `court_ruling`, `statistic`, `report`, `other`.

Done when all five promises have a status with reasoning, every event cites captured sources, and `bun scripts/trial-check.ts <state>` passes.

### 4. Report

Write `docs/reports/trial/<state>-<your-model>.md`. For each promise:
- The status in one line, and the evidence it rests on.
- How the done-when was decided, and whether the wording allowed more than one reading.
- Which sources held the decisive evidence, and which were hard to search or unavailable.

Then, for the whole state:
- Where the draft model in the brief did not fit: statuses, adoption values, event types or fields that were missing or ambiguous.
- How the parliament documentation system can be searched: URL patterns, search forms, whether documents are PDFs, anything that blocks automated access.
- What a person would need to review for each promise before publishing.

Done when the report covers all five promises and both whole-state sections.

## Rules

- Quotes are copied exactly from the capture's text, OCR text or raw HTML.
- Only `scripts/archive-fetch.ts` writes captures. Entries in `archive/tracked-urls.json` are append-only: keep URLs that failed or turned out irrelevant, since their captures stay in the log.
- Change only `data/trial/<state>/`, `archive/tracked-urls.json` and your report. Leave `data/parties/` unchanged.
- Keep the report as Markdown in `docs/reports/trial/`. Upload nothing anywhere: no Postplan, no gists, no pastebins. The only allowed external write is the Wayback request the fetch script makes.
- Do not log in, post or submit forms. Search forms that only read, such as a parliament's document search, are fine.
- Do not fetch social media sites.
- Scratch files go in `tmp/`. Leave git alone.
