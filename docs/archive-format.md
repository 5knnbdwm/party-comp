# Archive format

How the project stores party information and the documents it came from. The goal is to prove what a party published at a given time, and to detect when a party changes or removes something without saying so.

Two layers:

1. **Captures** in `archive/`: raw copies of fetched URLs. They are immutable and append-only.
2. **Facts** in `data/parties/`: statements about a party. Each fact cites one or more captures.

A fact without a capture behind it does not go into `data/`.

## Layout

```
archive/
  image-rules.json           optional per-page image preservation overrides
  image-decisions.json       one verdict per image hash, see "Image decisions"
  tracked-urls.json          URLs we re-fetch to detect changes
  captures.jsonl             append-only log, one line per fetch
  blobs/<sha256>.<ext>       raw bytes exactly as fetched, never modified
  text/<sha256>.txt          extracted text of that blob, for diffing
  ocr/<sha256>.txt           OCR text for scanned PDFs with an empty text layer
data/
  parties/<state>/<party-slug>.json
  promises/<state>/<party>.json   promises extracted from programs, see docs/promise-format.md
  core-parties.json          core party slugs per state, see "Core parties" in the brief
  trial/<state>/             Phase 1 trial: selection.json and one trace file per model
scripts/
  archive-fetch.ts           fetches tracked URLs and appends captures
```

State slugs: `sachsen-anhalt`, `berlin`, `mecklenburg-vorpommern`. Party slugs are lowercase ASCII, such as `afd`, `cdu`, `spd`, `gruene`, `linke`, `fdp`, `bsw`, `freie-waehler`, `tierschutzpartei`.

All timestamps are ISO 8601 in UTC with a `Z` suffix, such as `2026-09-16T18:12:00Z`.

## Tracked URLs

`archive/tracked-urls.json` is an array. It lists every URL that backs a fact or holds a party document.

```json
{
  "url": "https://example-party.de/wahlprogramm-2026.pdf",
  "state": "sachsen-anhalt",
  "party": "afd",
  "kind": "program_full",
  "label": "Wahlprogramm zur Landtagswahl 2026",
  "publisher_type": "party",
  "added_at": "2026-09-16T18:10:00Z",
  "found_on": "https://example-party.de/programm"
}
```

- `party` is `null` for URLs that cover all parties, such as the official list of admitted parties.
- `found_on` is the page that linked this URL, so the discovery path can be checked again later.
- `retired` is optional, `{at, reason}`. It marks a URL that will not serve its document again, and a sweep skips it. The entry and its captures stay, because a dead URL is evidence of where a party published and that it is gone; removing the entry would make "we looked and it was gone" indistinguishable from "we never looked". Retire a URL only once that is established, not after one failure. `bun scripts/archive-fetch.ts --url <url>` still fetches a retired URL, so a retirement can be rechecked.
- `kind` is one of:
  - `party_website`, `parliamentary_group_website`
  - `program_full`, `program_short`, `program_easy_language`, `program_html`, `points_list`, `program_immediate`
  - `candidate_list`, `lead_candidate_page`
  - `election_authority_page`, `election_result`
  - `coalition_statement`, `sondierungspapier`, `coalition_agreement`
  - `position_paper`, `press_release`
  - `drucksache`, `plenary_protocol`, `budget`, `gazette`, `government_statement`, `statistic`, for tracing promises through parliament and government
  - `other`
- `publisher_type` is one of `party`, `parliamentary_group`, `election_authority`, `parliament`, `government`, `press`.

## Captures

Each fetch appends one line to `archive/captures.jsonl`. Earlier lines are never edited or removed.

```json
{
  "id": "cap_20260916T181200Z_3f9a1c2b",
  "url": "https://example-party.de/wahlprogramm-2026.pdf",
  "final_url": "https://example-party.de/wp-content/uploads/wahlprogramm-2026.pdf",
  "retrieved_at": "2026-09-16T18:12:00Z",
  "http_status": 200,
  "content_type": "application/pdf",
  "bytes": 2481734,
  "sha256": "3f9a1c2b…",
  "text_sha256": "a81d…",
  "blob": "archive/blobs/3f9a1c2b….pdf",
  "text": "archive/text/3f9a1c2b….txt",
  "http_last_modified": "Tue, 01 Sep 2026 10:00:00 GMT",
  "http_etag": "\"abc\"",
  "pdf_info": { "title": "…", "creation_date": "…", "mod_date": "…", "pages": 84 },
  "wayback_url": "https://web.archive.org/web/20260916181300/https://example-party.de/wahlprogramm-2026.pdf",
  "previous_capture": "cap_20260910T090000Z_3f9a1c2b",
  "content_changed": false,
  "text_changed": false,
  "error": null
}
```

- `id` is `cap_` + compact `retrieved_at` + `_` + the first 8 hex characters of `sha256`. Two URLs serving identical bytes would collide if they also started in the same millisecond, so the fetch script gives each capture a millisecond of its own. Under concurrency a `retrieved_at` can therefore sit a few milliseconds past the clock reading.
- `text_sha256` hashes the extracted text: `pdftotext -layout` for PDFs, readable main text for HTML. Byte changes often come from page chrome or PDF metadata alone. A change in `text_sha256` is the stronger signal that the content changed.
- `previous_capture` is the latest earlier capture of the same `url`, or `null`. `content_changed` and `text_changed` compare against it, and are `null` on the first capture.
- A failed fetch still gets a line, with `http_status` and `error` set and the hash fields `null`. A document that disappears is evidence too.
- `pdf_info` is `null` for non-PDFs. `wayback_url` is `null` when no snapshot was requested or the request failed.
- Blobs are content-addressed, so identical bytes are stored once.
- A scanned PDF has an empty text file. The fetch script then writes OCR text to `archive/ocr/<sha256>.txt`, with pages separated by form feeds, rendering pages at 400 dpi and running Tesseract with `vendor/tessdata/deu.traineddata` on the thresholded red channel, which recovers blue text on white that plain OCR misses. The capture record does not change; OCR text is derived and can be regenerated with `bun scripts/archive-ocr.ts`, or for one file with `--redo <sha256>`. Regenerating changes the text, so quotes taken from the old OCR text must be checked again. Quotes from scanned PDFs are copied from the OCR text, including its OCR spelling.
- `previous_capture`, `content_changed` and `text_changed` are derived from the order of captures per URL, not observed. When two branches both append to the same log, their chains describe different timelines and only one can be true of the merged file. Merging the two logs and recomputing those three fields is then allowed, and is the only edit ever made to an existing line: ids, timestamps, hashes, bodies and page snapshots stay exactly as recorded. It happened once, on 21 Sep 2026, when the page-snapshot run was merged back; `docs/reports/2026-09-21-post-election-sweep.md` records it. Avoid it by not running fetches on two branches at once.
- `archive/blobs`, `archive/text` and `archive/ocr` are tracked in the private development repository. Blobs use Git LFS. The public export omits all three directories. `captures.jsonl` holds their hashes, so a restored copy can be verified.

## HTML page snapshots

**Not enabled yet.** `scripts/archive-page.ts` implements everything below and `scripts/archive-fetch.ts` does not call it, so no capture currently carries a `page` record. The schema allows one, the validator checks one when present, and the viewer falls back to the raw HTML without it. This section describes what happens once the fetch script is wired up; until then, read every sentence below as the intended behaviour rather than the current one.

New HTML captures also have an optional `page` record. The original `blob`, extracted text and their change flags keep their existing meaning. `page.blob` and `page.sha256` identify a separate HTML view with local asset references. `page.files` lists every raw or derived asset with its blob path and SHA-256. All files use `archive/blobs/`, so identical bytes share storage and existing private Git LFS rules apply. No old capture is changed or backfilled.

Stylesheets, including nested imports, are fetched during each capture. Their original bytes and a rewritten offline copy are retained. Images kept as evidence retain their original bytes. `page.resources` records asset URLs, final URLs, retrieval times, image dimensions, the action taken and errors. Decorative originals are not stored. An image replaced from declared dimensions has a null retrieval time because it was not fetched. Asset changes can produce a new page snapshot even when the HTML and extracted text have not changed; inspect `page.sha256` separately from `content_changed`.

Fonts are not downloaded. Font-face rules are removed from the derived CSS. Scripts, embedded media and event handlers are removed from the derived HTML, and the viewer blocks scripts, fonts and live asset requests. This is a static page capture, not a browser rendering: JavaScript-only content is not collected and system fonts may alter wrapping.

### Images

Unknown images are preserved, including CSS background images and images with empty alt text. Empty alt text alone does not prove that an image is decorative. Images explicitly marked `role="presentation"` or `aria-hidden="true"` receive a neutral SVG placeholder. A reviewer can override those decisions per tracked page in the optional `archive/image-rules.json`:

```json
{
  "https://example-party.de/programm": {
    "preserve": [".promise-chart", "#campaign-statement"],
    "placeholder": [".decorative-photo", "header .logo"],
    "preserve_urls": ["https://example-party.de/chart.png"],
    "placeholder_urls": ["https://example-party.de/background.jpg"]
  }
}
```

The page key matches the tracked URL before redirects. Selector rules apply to `img` elements and their responsive picture sources. URL rules use resolved absolute asset URLs and also cover CSS backgrounds and SVG image references. Preserve URLs win over placeholder URLs; URL decisions override selectors. Preserve selectors win over placeholder selectors and decorative HTML attributes. Choose preservation for graphics with promises, figures, charts or statements.

### Image decisions

`archive/image-decisions.json` holds one verdict per image, keyed by the image's SHA-256:

```json
{
  "3f9a1c2b…": { "action": "placeholder", "reason": "Parteilogo ohne Aussage", "decided_by": "gpt-5.6-luna", "decided_at": "2026-09-21T11:40:00Z" }
}
```

`bun scripts/classify-images.ts` fills it. It shows a model every stored image together with the page it appears on and asks whether the image carries evidence — statements, demands, programme points, figures, charts, posters, quotes, named politicians — or is page furniture. Size is not a criterion; content is. Each image is judged once on its bytes, so the verdict applies everywhere it appears and a re-fetch cannot flip it.

Unknown images are preserved, so a failed or skipped classification never loses evidence. `image-rules.json` outranks a verdict, which makes it the human override. Verdicts carry their reason, model and time so a reviewer can audit them. A verdict only takes effect on the next capture of a page; it never alters a stored snapshot.

Placeholders contain only a tiny SVG with the image's width, height and viewBox. Declared HTML dimensions avoid a download for a decorative image. Otherwise the image is downloaded to determine its dimensions, then discarded; this saves archive space, not necessarily bandwidth. Responsive image candidates retain their own ratios. The SVG inherits the page's sizing and object-fit rules. Missing or unsupported images without known dimensions fall back to a square and generate a warning, so those layouts cannot be guaranteed.

Each page is limited to 150 distinct asset URLs, 8 MiB per asset and 25 MiB downloaded in total, with CSS imports limited to eight levels. Failures and limits appear in `page.warnings` and the viewer's Details tab. If page construction fails entirely, `page_error` records the problem while the raw capture remains usable. Run a new capture after adjusting rules; never add current assets to an old timestamp. `archive-validate.ts` verifies snapshot and asset hashes alongside the raw captures.

## Party facts

`data/parties/<state>/<party-slug>.json`:

```json
{
  "state": "sachsen-anhalt",
  "slug": "afd",
  "facts": [
    {
      "key": "lead_candidate",
      "value": "Name Surname",
      "observed_at": "2026-09-16T18:20:00Z",
      "sources": [
        { "capture": "cap_20260916T181500Z_77aa01de", "quote": "exact text from the source", "page": null }
      ]
    }
  ],
  "gaps": [
    {
      "key": "program_short",
      "checked_at": "2026-09-16T18:25:00Z",
      "note": "No short program found on the party website or the state association site.",
      "searched": ["https://example-party.de/programm"]
    }
  ]
}
```

- `facts` is append-only. When a value changes, add a new fact with the same `key` and a later `observed_at`. The current value is the latest one per key, and the older entries are the history.
- Every source names a capture id that exists in `captures.jsonl`. `quote` is verbatim text from that capture. `page` is set for PDFs.
- A fact with several values, such as two lead candidates, gets one fact per value.
- The quotes must show the value, not just mention the party. `bun scripts/archive-validate.ts` enforces this for simple values:
  - `name_full`, `name_short`, `lead_candidate`: a quote contains the value, ignoring case and whitespace.
  - `ballot_list_number`, `seats_before_election`: a quote contains the number. Zero seats needs no number.
  - `election_result`: the quotes contain the vote share, as `43.8` or `43,8`, and the seat count. `seats` is `null` when the vote share is published but the seat allocation is not yet determined, and then no seat count is required; add a later fact with the same key once the seats are known.
  - URL keys and `social_account`: a source capture is of that URL, or a quote contains it.
  - `coalition_position`, `sondierung_status`: the speaker's last name appears in a source capture, `stated_on` is no later than the newest source's retrieval date, and the summary does not start with a date. Whether the summary is fair is checked by review.
- `bun scripts/extract-social-accounts.ts` adds `social_account` facts from captured official pages. It takes profile links from the site header, footer and navigation of state party and parliamentary group sites, and from the body of lead candidate pages, minus the party's own accounts. It skips posts, share buttons and feed widgets. Run it after capturing new official pages. It never adds a fact twice.
- `gaps` records what we looked for and did not find. It keeps "not found on date X" separate from "never existed". Every gap lists at least one searched page, and each searched page has a capture from before `checked_at`, so the page as we saw it is on record. An item with neither a fact nor a gap has not been checked yet. The text files drop headers, footers and navigation, so links to social profiles, news pages and documents often exist only in the raw HTML blob. Search the blob before recording a gap.

Fact keys:

| Key | Value |
|---|---|
| `name_full`, `name_short` | Party name as used on the ballot. |
| `website`, `state_association_website`, `parliamentary_group_website` | URL. |
| `ballot_admitted` | `true` or `false`, from the election authority. |
| `ballot_list_number` | Number or position on the ballot. |
| `lead_candidate` | Person's name. |
| `program` | Tracked URL of a program document. The tracked URL's `kind` says which type. |
| `social_account` | Profile URL, value such as `{"platform":"x","linked_from":"state_party","url":"…"}`. `linked_from` is `state_party`, `parliamentary_group` or `lead_candidate`: the kind of official page that links the profile. It records what the capture proves, not who runs the account. A state party site can link the federal party's or its lead candidate's profile. |
| `in_parliament_before_election` | `true` or `false`, with seat count if known. |
| `seats_before_election` | Integer seat count immediately before the election, sourced separately from the previous election result. |
| `ballot_scope` | `"Landesliste"`, `"Bezirkslisten"` or `"Nur Kreiswahlvorschläge"`. Distinguishes list admission from constituency-only admission. |
| `election_result` | `{"second_vote_pct":…, "seats":…, "status":"preliminary"}`, or `"final"`. `seats` is `null` while only the vote share has been published. |
| `coalition_position` | A statement on coalition options: `{"stated_on":"2026-09-12","speaker":"Werner Graf","speaker_role":"Spitzenkandidat","summary":"…"}`. `stated_on` is the day the statement was made, or the source's publication date when that is all we know. `speaker` is the named person, or the body that issued it when no person is named, such as `Landesvorstand CDU Sachsen-Anhalt` or `CDU-Sprecherin`. `speaker_role` is the role at the time. `summary` stays close to the quoted wording and carries no date. A person's statement stays that person's, even when they lead the party. |
| `sondierung_status` | Who the party is in exploratory or coalition talks with. Same value shape as `coalition_position`. |

When something important fits no key, add a key and document it in this table in the same change.

## Re-fetching

`bun scripts/archive-fetch.ts` fetches every tracked URL, stores new blobs and text, and appends captures. It prints every URL whose `text_changed` is `true` or whose fetch newly fails. Run it on a schedule to catch silent updates. To inspect a change, `diff` the two text files from the captures.

Use `bun scripts/archive-fetch.ts --html` to re-fetch only tracked URLs with a previous HTML capture. PDF and other document URLs are excluded.

Eight URLs are fetched at a time; `--concurrency <n>` changes that. The limit of one request per second per host still holds, and it covers a page's images and stylesheets too, because they sit on the page's own host. That per-host budget, not the pool, is what a sweep spends most of its time waiting on, so the script deals hosts out round robin to keep the workers on different sites. Captures are appended as each fetch finishes, which means `captures.jsonl` follows completion order rather than the order of `tracked-urls.json`. Order per URL is unaffected, and that is the only order `previous_capture` depends on.
