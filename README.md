# party-comp

A public record of what German parties promise before a state election, and what happens to those promises afterwards.

The plan: take each party's program, roughly 100 concrete promises, and follow every promise into the coalition agreement, through parliament and the budget, to a status. Every status links to the document, page or timestamp that backs it. Weekly summaries on X and other platforms report what changed.

It starts with three states:

- **Sachsen-Anhalt**, which voted on 6 September 2026 and has no coalition yet.
- **Berlin** and **Mecklenburg-Vorpommern**, which both vote on 20 September 2026.

The project is not affiliated with any party. It applies one method to every party.

## Status

Early. There is no website yet. This repo currently holds the evidence archive: what each party published before and just after the elections, stored so that later edits or deletions can be detected.

- 56 parties admitted to the ballot in the three states have a party file in `data/parties/`.
- 901 facts: names, ballot positions, election results, programs, lead candidates, social media accounts, coalition statements and talks.
- 516 tracked URLs and 699 captures, each with a SHA-256 hash and retrieval time.
- 44 promises from the AfD Sachsen-Anhalt flyers "Kernpunkte" and "100 Tage für Sachsen-Anhalt", the first records in the promise model. Unreviewed.

Deep research covers the core parties only:

- Sachsen-Anhalt: the parties that won seats. AfD, CDU, SPD, Die Linke, Grüne, BSW.
- Berlin, until the vote: CDU, SPD, Grüne, Die Linke, AfD, BSW, FDP.
- Mecklenburg-Vorpommern, until the vote: SPD, AfD, CDU, Die Linke, Grüne, FDP, BSW.

Coalition positions and talks status record who said what, and when. Each statement has a date, a speaker and the speaker's role, so a lead candidate's interview is not presented as the party's decision. An AI model extracted the statements for Sachsen-Anhalt and Berlin, and a person reviewed them on 17 September 2026. The commits marked "unreviewed sol run" predate that review.

## How the data works

Nothing goes into `data/` without a stored copy of its source.

1. **Captures.** `scripts/archive-fetch.ts` downloads each tracked URL. It appends a line to `archive/captures.jsonl` with the time, HTTP status, hash and file paths. The raw file is stored under its hash, along with its extracted text. Scanned PDFs get OCR text. Earlier lines are never changed, and a failed fetch is logged too.
2. **Facts.** Each fact in `data/parties/<state>/<party>.json` cites one or more captures, with the exact quoted passage. Facts are append-only: a change adds a newer entry, and the history stays.
3. **Gaps.** When something was searched for and not found, a gap records the date and the captured pages that were checked. A missing fact without a gap means nobody has looked yet.
4. **Change detection.** Running the fetch script again captures every URL once more. It reports each document whose text changed or that disappeared.

`scripts/archive-validate.ts` checks all of this: hashes match their files, and every quote appears in its capture. Quotes must also show the fact's value, so a lead candidate fact has to quote the candidate's name. Every gap must name captured pages.

The full format is in [`docs/archive-format.md`](docs/archive-format.md).

The raw captured files (`archive/blobs`, `archive/text`, `archive/ocr`) are not in this repo yet. Many are third-party documents, including press articles, and how to publish them is still open. `captures.jsonl` holds their hashes, so any copy can be verified against it.

## Repository layout

```
archive/
  tracked-urls.json     URLs that back facts or hold party documents
  captures.jsonl        one line per fetch, append-only
data/parties/           one JSON file per party per state
data/promises/          promises extracted from party programs
data/trial/             Phase 1 trial selections and traces
docs/
  project-brief.md      aims, editorial rules, status model, roadmap
  archive-format.md     data format and validation rules
  promise-format.md     promise record format
  tasks/                instructions given to AI agents, per run
  reports/              what each run found, plus review notes
scripts/                fetch, OCR, validation, social account extraction
```

## Running it

Requirements: [Bun](https://bun.sh), Poppler (`pdftotext`, `pdfinfo`, `pdftoppm`), Tesseract, ImageMagick and `unzip`. On macOS:

```sh
brew install poppler tesseract imagemagick
bun install
mkdir -p vendor/tessdata
curl -L -o vendor/tessdata/deu.traineddata https://github.com/tesseract-ocr/tessdata_best/raw/main/deu.traineddata
```

Then:

```sh
bun scripts/archive-fetch.ts                 # re-fetch every tracked URL and report changes
bun scripts/archive-fetch.ts --url <url>     # fetch one tracked URL
bun scripts/archive-fetch.ts --wayback       # also request an Internet Archive snapshot
bun scripts/archive-ocr.ts                   # OCR scanned PDFs that lack text
bun scripts/extract-social-accounts.ts       # add social accounts linked from official pages
bun scripts/archive-validate.ts              # check the archive and all facts
bun scripts/promise-check.ts                 # check promise records against their sources
bun scripts/trial-check.ts <state>           # check a Phase 1 trial
bun test
```

The validator needs the raw captured files. On a fresh clone they are missing, so it reports missing blobs until they are restored or fetched again. A new fetch gives new captures with new timestamps.

## How AI is used

AI agents find sources, extract facts and draft reports. The instructions for each run are in `docs/tasks/`, and their reports are in `docs/reports/`, including what went wrong. A person reviews the results before anything is published beyond this repo. The editorial rules are in the [project brief](docs/project-brief.md). For example: "no evidence found" never becomes "promise broken", and the project publishes no single party score.

## Roadmap

1. Archive every party before the 20 September elections. Done for core parties in all three states.
2. After 20 September, sweep all admitted parties once, then narrow Berlin and Mecklenburg-Vorpommern to the parties that won seats.
3. Trace five promises per state from the previous term with two AI models, to test the method. Done, see `docs/reports/trial/2026-09-17-trial-comparison.md`; statuses await review.
4. Define the promise and status model from that trial. Done, see "Core model" in the project brief.
5. Extract promises from the 2026 programs of the parties likely to govern.
6. Build the website, then weekly summaries.

## Corrections

Found a wrong fact, a misleading summary or a missing statement? Open an issue with a link to the source. Corrections are recorded publicly, never silently overwritten.

## License

Not chosen yet. Until a license is added, all rights are reserved.
