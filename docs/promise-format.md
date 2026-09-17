# Promise format

How promises extracted from party programs are stored. The concepts and editorial rules behind each field are in `docs/project-brief.md`, "Core model". Coalition commitments, events and statuses get their format when the first coalition agreement of this term is tracked.

## Files

`data/promises/<state>/<party>.json`, one file per party per state:

```json
{
  "state": "sachsen-anhalt",
  "party": "afd",
  "election": "2026-09-06",
  "promises": [
    {
      "id": "sachsen-anhalt-afd-001",
      "text": "Die Rundfunkstaatsverträge kündigen.",
      "sources": [
        { "capture": "cap_…", "quote": "exact text from the capture", "page": 2 }
      ],
      "topic": "medien",
      "competence": "mixed",
      "commitment_type": "own_action",
      "done_when": "Das Land Sachsen-Anhalt hat die Kündigung der Rundfunkstaatsverträge erklärt.",
      "measure": null,
      "deadline": { "type": "relative", "text": "100 Tage nach Regierungsübernahme", "anchor": "government_start" },
      "parent": null,
      "notes": null,
      "extracted_by": "claude-opus-5",
      "extracted_at": "2026-09-17T14:00:00Z",
      "reviewed_at": null
    }
  ]
}
```

## Fields

| Field | Value |
|---|---|
| `id` | `<state>-<party>-<three digits>`. Numbers are never reused. |
| `text` | Readable German rendering of the commitment, one line, no hyphenation or all-caps styling. The party's own wording, not a paraphrase that sharpens or softens it. |
| `sources` | Every program document stating this commitment. `quote` is exact text from the capture's text, OCR text or raw HTML, including OCR errors. `page` is set for PDFs. The capture must be a tracked program document of the same party: `program_full`, `program_short`, `program_easy_language`, `program_html`, `points_list` or `program_immediate`. |
| `topic` | One of `arbeit`, `bildung`, `demokratie`, `digitales`, `energie`, `familie`, `finanzen`, `gesundheit`, `innere_sicherheit`, `justiz`, `kultur`, `landwirtschaft`, `medien`, `migration`, `soziales`, `umwelt`, `verkehr`, `verwaltung`, `wirtschaft`, `wohnen`. |
| `competence` | `state`, `federal`, `eu`, `municipal` or `mixed`. |
| `commitment_type` | `own_action` or `support_external`. A promise to "kämpfen für", "sich einsetzen für" or start a Bundesrat initiative towards a result others decide is `support_external`, and its done-when tests the state's own action. |
| `done_when` | German completion test, or `null` when the promise is too vague for one. |
| `measure` | `null`, or `{unit, target, baseline}` for promises about a quantity, such as `{"unit": "Euro je Auszubildendem", "target": 1500, "baseline": null}`. `target` is `null` when the promise names a direction but no number, such as "reduce the number of ministries" from a baseline of nine. |
| `deadline` | `{"type": "none"}`, `{"type": "date", "date": "2027-12-31"}`, `{"type": "recurring", "every": "year", "from": "2027"}` or `{"type": "relative", "text": "…", "anchor": "government_start"}`. `anchor` is `government_start`, `election`, `term_end` or `other`. |
| `parent` | The id of the broader promise this concrete clause was split from, or `null`. |
| `notes` | Anything a reviewer needs: OCR problems, a second reading of the wording, overlap with another promise. Or `null`. |
| `extracted_by`, `extracted_at` | Model or person, and time of extraction. |
| `reviewed_at` | Time a person approved the record, or `null`. |

`bun scripts/promise-check.ts` checks all files: shape, id prefix and uniqueness, parents, and every quote against its capture.
