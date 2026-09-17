# Promise trial: comparison of two traces per state

17 September 2026. Five coalition promises per state from the previous term: Sachsen-Anhalt 2021–2026, Berlin 2023–2026 and Mecklenburg-Vorpommern 2021–2026. gpt-5.6-sol selected and traced them. gpt-5.6-terra traced the same promises without seeing sol's work. Both traces pass `bun scripts/trial-check.ts`, and every quote appears in its captured source. No person has reviewed the statuses yet.

## Statuses

| Promise | Kind | sol | terra | Cause of the difference |
|---|---|---|---|---|
| ST: 7,000 police officers | measurable | partially_implemented | partially_implemented | |
| ST: Tariftreue- und Vergabegesetz by mid-2022 | law | approved | implemented | Status rule read differently, deadline missed |
| ST: Kulturstiftung base funding from 2022 | budget | approved | implemented | Budget appropriation read as approval or as completion |
| ST: act against all forms of extremism | vague | not_assessable | not_assessable | |
| ST: Bundesrat initiative for BAföG reform | federal | announced | no_evidence_found | Different evidence found |
| BE: one new steel boat per year from 2024 | measurable | approved | announced | terra missed the 2026/2027 budget line |
| BE: replace the Allgemeines Zuständigkeitsgesetz | law | implemented | implemented | |
| BE: climate special fund of 5 billion euros | budget | blocked | blocked | |
| BE: leading European technology location | vague | not_assessable | not_assessable | |
| BE: Bundesrat initiative on threats to witnesses | federal | implemented | implemented | |
| MV: 1,000 school posts | measurable | implemented | implemented | |
| MV: 8 March as public holiday | law | implemented | implemented | |
| MV: senior ticket at 1 euro a day | budget | implemented | reversed | Price later rose above the promise; no rule for durability |
| MV: leading location for climate-neutral business | vague | not_assessable | not_assessable | |
| MV: support a 12 euro federal minimum wage | federal | implemented | no_evidence_found | sol counted the federal outcome, terra required the state's own action |

The two models agree on 9 of 15 statuses. Four of the six disagreements come from rules the brief leaves open. Two come from evidence that one model found and the other did not.

Adoption values differ in 4 of 15 promises: `changed` against `adopted` twice, and `not_in_programs` against `changed` twice. Competence differs in 3, `mixed` against `state`. sol writes done-when tests in English, terra in German.

## Spot checks

- **Berlin steel boats.** Both traces cite the Senate's written answer of 16 May 2025: "Im Jahr 2024 wurde seitens der Polizei Berlin kein Stahlboot beschafft, da keine Haushaltsmittel zur Beschaffung von Booten zur Verfügung standen." sol also found the 2026/2027 police budget with 1.25 million euros per year for police boats. terra did not find it, so its `announced` rests on less evidence.
- **MV senior ticket.** terra cites the cabinet decision of 27 June 2023, when the ticket cost 29 euros a month (348 euros a year), and a ministry page from July 2026 giving 43 euros a month (516 euros a year). The quotes match their sources. The disagreement is about the rule, not the facts.

## Gaps in the draft model

Several reports raised these independently, from different promises.

1. **`approved` and `implemented` overlap when the done-when is enactment itself.** The brief says a passed law is `approved` when the done-when describes an outcome. Two runs read it as "passed laws are always `approved`".
2. **Missed deadlines have no structured place.** A late law and two missed annual boat purchases survive only in prose.
3. **Promises to "support" or "work towards" a federal outcome.** Is the test the state's own action, the federal result, or both shown separately?
4. **One adoption value cannot describe a coalition of two or three parties.** The programs also cannot record "checked, not found" per party, so an empty list looks like missing research.
5. **Money has stages:** proposed, appropriated, committed, spent, delivered. Budget promises turn on these.
6. **Durability.** A promise can be met and later stop being met, as with the senior ticket's price. `reversed` suggests the whole promise was undone.
7. **Recurring and relative deadlines,** such as "every year from 2024", "within five years", "schnellstmöglich".
8. **Units and baselines for counts.** People, posts and full-time equivalents are not interchangeable.
9. **Vague promises containing a concrete clause.** The MV climate sentence includes trackable green business parks.
10. **Exact PDF quotes keep line breaks and hyphenation.** A reader-friendly display text next to the exact audit quote would help.

## Evidence depth

Most promises have one to three events. The traces found the decisive documents but not a full timeline of every step. terra's traces took about 4 to 5 minutes per state, sol's 12 to 18 minutes including selection. In the two evidence disagreements, sol found a source that terra did not.

## Parliament documentation systems

| State | System | Automation |
|---|---|---|
| Sachsen-Anhalt | PADOKA | No API or bulk export found. Stateful search. Documents are PDFs with direct URLs such as `padoka.landtag.sachsen-anhalt.de/files/drs/wp8/drs/d1159rge.pdf`, but suffixes must be taken from links. |
| Berlin | PARDOK | Daily XML open data is the best entry point. Documents are PDFs under several hosts and path patterns. |
| Mecklenburg-Vorpommern | Parldok | Public search form, no API found. Direct URLs `/parldok/dokument/<id>/<slug>`, PDFs sometimes without extension. |

In all three, two-column plenary protocols interleave columns in extracted text, and written government answers were the most useful single source.

## Decisions needed before Phase 2

1. Status rule: judge `implemented` strictly against the done-when, so enactment is `implemented` when enactment is the test.
2. Deadlines: add a structured deadline with a type (date, recurring, relative, none) and a `deadline_missed` event.
3. "Support" promises: the done-when tests the state's own action; the external outcome is shown separately and never earns the status.
4. Adoption per party, with "checked, not found" recorded explicitly.
5. Budget events split into `budget_proposed`, `budget_appropriated` and `funds_spent`.
6. Durability: the status describes the current state, with a new status such as `lapsed` for promises that were met and no longer are. The history stays visible.
7. Counts carry a unit and a baseline in the done-when.
8. Concrete clauses inside vague promises become their own promises, under the existing splitting rules.
9. Done-when tests are written in German, since the site is German.
10. Model choice: sol for tracing. terra missed evidence sol found, so it could at most serve as a cheap second check that flags disagreements for review.
