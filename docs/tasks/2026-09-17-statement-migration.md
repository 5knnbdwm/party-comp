# Task: restructure existing coalition statements

Read `docs/archive-format.md`, in particular the `coalition_position` row of the fact key table.

`tmp/positions-worklist.json` lists 48 existing `coalition_position` and `sondierung_status` facts. Their `old_value` is a single string, often with a date mixed into the text. Each item includes its sources with the quote and about 900 characters of context before the quote.

A person has reviewed these facts and found them correct. Your job is to restructure them without changing what they say.

For every item, write one object to `tmp/positions-migration.out.json`, as a JSON array in worklist order:

```json
{ "file": "…", "index": 12, "stated_on": "2026-09-12", "speaker": "Werner Graf", "speaker_role": "Spitzenkandidat Bündnis 90/Die Grünen Berlin", "summary": "…" }
```

- `stated_on`: the date the statement was made. Take it from `old_value` when it has one. Otherwise take it from the source context, such as the article or press release date. Use `YYYY-MM-DD`.
- `speaker`: the person who made the statement, as named in the context, for example "sagte Graf" or an interview with Alexander King. When the source is a party or parliamentary group press release with no named person, use the issuing body, such as "Landesvorstand CDU Sachsen-Anhalt" or "CDU-Fraktion Sachsen-Anhalt". When only a spokesperson is quoted, use "Sprecherin CDU Sachsen-Anhalt" or similar. The speaker's last word must appear in the source context.
- `speaker_role`: the speaker's role as the source states it or as clearly implied, such as "Spitzenkandidatin", "Landesvorsitzender", "Fraktionsvorsitzende", "Pressemitteilung". Keep it short.
- `summary`: `old_value` with the date removed and nothing else changed. When removing the date breaks the sentence, as in "Lehnt am 30. August 2026 die Unterstützung … ab", make the smallest edit that restores it. Keep the party or group as the grammatical subject if the old text had it.

Done when the output array has exactly 48 objects in worklist order, every `speaker` last word appears in its item's source context, and no `summary` contains a date.

Rules:
- Write only `tmp/positions-migration.out.json`. Leave `data/`, `archive/` and git unchanged.
- Upload nothing anywhere. No Postplan, gists or pastebins.
