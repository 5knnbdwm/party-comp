# Project brief: party promise tracker

Last updated 2026-09-17. This is the source of truth for what the project is, what it tracks, and the editorial rules everything must follow. When code or a later decision contradicts this brief, update the brief in the same change.

## Aim

Make it easy for anyone in Germany to see what a state government promised and what became of each promise. Every status on the site points to the document, page or timestamp that proves it.

The project has two outputs:

1. **A website.** Each promise gets a permanent page. The page shows the original wording, whether and how the coalition adopted it, and a dated timeline of evidence.
2. **Weekly posts.** They go out on X, Bluesky and Instagram, maybe Threads later. Each post covers what changed that week and links to the promise pages.

The unit of the project is the **promise**, one assessable commitment. A party program is roughly 100 promises. A coalition agreement is a set of commitments that link back to promises from each coalition party.

## Scope

| State | Election | Why |
|---|---|---|
| Sachsen-Anhalt | Landtag election on 6 Sep 2026 | The original motivation. The AfD published a points-style program before the election. |
| Berlin | Abgeordnetenhaus election on 20 Sep 2026 | Second state. Its parliament publishes machine-readable open data, which makes it the easiest pipeline to prototype. |
| Mecklenburg-Vorpommern | Landtag election on 20 Sep 2026 | Votes the same day as Berlin. |

The brief does not record election results or coalition outcomes yet. Check them and add them here once known. They decide which parties count as governing and which as opposition.

### Core parties

Deep research (lead candidates, social accounts, coalition statements, every program document) covers only core parties. All other admitted parties keep a basic record: name, admission and whatever the first pass found.

- Sachsen-Anhalt: parties that won seats on 6 Sep 2026.
- Berlin and Mecklenburg-Vorpommern, until the election: parties in the outgoing parliament, plus any party at 3% or more in the latest poll of at least two institutes on wahlrecht.de.
- Berlin and Mecklenburg-Vorpommern, after 20 Sep 2026: parties that won seats.

After 20 Sep 2026, run one sweep over every admitted party in all three states to catch surprises. Then narrow Berlin and Mecklenburg-Vorpommern to the parties that won seats.

More states can follow once the process works for these three. The rules below stay the same for every state and every party.

## Neutrality

The project applies one method to every party. Starting with the AfD means both supporters and opponents will check the site for bias, so its credibility depends on this.

- Every party gets the same status vocabulary, the same splitting rules and the same evidence bar.
- Text on the site and in posts describes what the evidence shows, using the status words below. Commentary and adjectives about parties or politicians stay out.
- The site shows no overall success percentage or party score. Ten small administrative steps should not outweigh one large unmet commitment, and a single number is what people screenshot out of context.

## Core model

### Promise

A promise is a single commitment with one completion test. Each promise records:

- Party, state and election.
- **Sources**: every program document that states it, each with a verbatim quote, page and capture. When a flyer and the full program state the same commitment, it is one promise with two sources.
- **Text**: a readable German rendering of the quote, without line breaks, hyphenation or capital-letter styling. The quote stays the evidence; the text is for display.
- **Topic**, such as Bildung, Migration or Energie. Readers can follow topics.
- **Competence**: state, federal, EU, municipal or mixed. A promise outside state competence is flagged, and the site never marks it as failed for that reason alone.
- **Commitment type**: `own_action` when the state can do it itself, `support_external` when the promise is to work towards something others decide, such as a Bundesrat initiative for a federal law. A `support_external` promise is judged only on the state's own action. The external outcome is shown next to it and never earns the status.
- **Done-when**: a written German criterion that says what counts as fulfilled, set before tracking starts. Example: "Der Landeshaushalt finanziert mindestens 1.000 zusätzliche Lehrerstellen" rather than "mehr Lehrer".
- **Measure**, for promises with a number: the unit, the target and the baseline. People, posts and full-time equivalents are different units.
- **Deadline**, structured as a date, a recurring period ("jedes Jahr ab 2024"), a relative period with its anchor ("100 Tage nach Regierungsübernahme") or none.
- **Parent**, when the promise is a concrete clause split out of a broader one.

A promise too vague to write a done-when for has no done-when, and gets status `not_assessable` once tracked. The AI leaves such promises vague and never invents a measurable version. A concrete clause inside a vague promise becomes its own promise with the vague one as parent.

The JSON format is in `docs/promise-format.md`.

### Splitting rules

- One promise holds one done-when. "More teachers and smaller classes" is two promises.
- Use the same granularity for every party. When one program is written as broad goals and another as small tasks, split both to the same level.
- A concrete, checkable clause inside a vague promise is split out, with the vague promise as its parent.
- If the project tracks a selection rather than the full program, the site states the selection rule publicly. The rule itself is an open decision, see below.

### Adoption into the coalition

A coalition commitment is a quote from the coalition agreement. It records adoption per governing party, because one value cannot describe a compromise between two or three parties. For each governing party it holds either the matching promises with a value, or `not_in_program`, which means the party's program was checked and holds no match:

- `adopted`: taken over in substance.
- `weakened`: taken over with a smaller target, a later date or softer wording.
- `changed`: taken over in a different form.

A party promise that no commitment takes over is `omitted`. Before an agreement exists, adoption is `pending`.

Keep the party programs intact. Coalition commitments link to the promises they came from, many to many. This linking is how compromises become visible, so the tracker never merges programs into one list that replaces the originals.

Opposition parties keep their promise pages. For them the site tracks their motions, bills and votes, and it holds them to no delivery standard.

### Implementation status

Status is a judgement of the evidence against the done-when. It describes the current state, carries the date it was last confirmed, and the history of earlier statuses stays visible.

| Status | Meaning |
|---|---|
| `not_assessable` | Too vague to have a done-when. |
| `no_evidence_found` | We found nothing yet. This is not the same as "nothing happened". |
| `announced` | A government member or party announced a step. |
| `proposed` | Formally proposed: cabinet draft, bill introduced, motion tabled, budget draft. |
| `approved` | Decided, but the done-when is not yet met: law passed but not in force, money appropriated but the promised result not delivered. |
| `partially_implemented` | Part of the done-when is met. |
| `implemented` | The done-when is met. |
| `lapsed` | The done-when was met and no longer is, while the measure still exists. Example: a ticket introduced at the promised price that later costs more. |
| `blocked` | Stopped by a court, a failed vote, a coalition veto or the federal level. |
| `abandoned` | The government has said it will not pursue the promise, or it has clearly dropped it. |
| `reversed` | It was implemented and then undone. |

Rules for statuses:

- `implemented` is judged strictly against the done-when. When the done-when is "Gesetz in Kraft", a law in force is `implemented`. When the done-when describes an outcome such as lower rents, the law in force is `approved`.
- `no_evidence_found` never becomes "broken" automatically.
- A missed deadline is a `deadline_missed` event. The status stays what the evidence shows, and the site shows the missed deadline next to it.
- Conflicting evidence stays visible on the promise page.

### Delivery

Delivery means measured outcomes, such as teachers actually employed or flats actually built. It is valuable and expensive to establish. Track it only for about 10 to 15 flagship promises per state that have a clear official statistic behind them.

### Events, sources, corrections

- **Event**: a dated piece of evidence about a promise. It holds the source, an exact quote, page or timestamp, and the proposed status change with reasoning against the done-when. It also records who reviewed it and when. Event types: `announcement`, `cabinet_decision`, `bill_introduced`, `law_passed`, `law_in_force`, `regulation_issued`, `budget_proposed`, `budget_appropriated`, `funds_spent`, `service_launched`, `government_answer`, `court_ruling`, `statistic`, `report`, `deadline_missed`, `other`. Money moves through proposed, appropriated and spent, and budget promises often turn on the difference.
- **Source**: URL, archived copy, content hash and retrieval date. Parties and governments edit or delete pages, so every cited document gets its own stored copy.
- **Correction**: a public entry when a published status or post was wrong. It says what changed and why. Corrections are never silently overwritten.

## Sources

The priority order is below. Official records are the foundation. Social media only supplies leads and claims.

1. **Parliament documentation.**
   - Berlin: PARDOK, with open data as daily updated XML metadata for Drucksachen, Plenarprotokolle, Ausschussprotokolle and Schriftliche Anfragen. See https://parlament-berlin.de/dokumente/open-data.
   - Sachsen-Anhalt: PADOKA, which links Drucksachen, Plenarprotokolle and videos. See https://www.landtag.sachsen-anhalt.de/dokumente/aktuelle-dokumente. We know of no API or bulk export, so plan for a scraper.
   - Mecklenburg-Vorpommern: the Landtag's parliamentary documentation system. Access method not yet checked.
2. **Written and oral questions to the government**, Kleine and Große Anfragen. Opposition questions often force the government to state the exact status of a project in writing, which makes them the cheapest reliable status source.
3. **Budgets**, both the Haushaltsplan and supplementary budgets. A promise with no money behind it rarely happens.
4. **Official gazettes**, the Gesetz- und Verordnungsblatt. Much implementation happens by regulation, without a plenary vote.
5. **Cabinet decisions, ministry press releases and implementation reports.**
6. **Official statistics**, for delivery tracking.
7. **Plenary and committee recordings.** Use official transcripts first. Transcribe video, for example with Whisper, only to fill gaps before the protocol appears. Keep timestamps so readers can check the passage.
8. **Social media and party statements** on X, Instagram, Facebook and party websites. A post proves that someone made a claim. Its content still needs checking against sources 1 to 7.

Access to social media is limited. The X API bills per use through prepaid credits. Meta offers almost no API access to public page content since CrowdTangle shut down, and scraping breaks platform terms. Check feasibility and cost before building anything that depends on social data.

## AI and human review

AI does most of the legwork. A human signs off on every judgement that gets published.

The pipeline:

1. **Extract** promises from programs and coalition agreements. Output: verbatim quote, page, proposed split, proposed competence and done-when.
2. **Collect** new documents from the sources above.
3. **Match** documents to promises and remove duplicates.
4. **Propose** events. Each proposal carries the exact passage, document date, page or timestamp, and reasoning that ties it to the done-when.
5. **Review.** A human approves, edits or rejects each proposed status change, done-when, split and adoption value.
6. **Publish** approved events to the site and draft the weekly post from them.
7. **Review the post** before it goes out.

The AI gets these mix-ups wrong most often, so reviewers check for them:

- A rejected amendment read as an adopted measure.
- An opposition proposal attributed to the government.
- A missed qualifier, such as "examine", "where possible" or "subject to funding".
- Two politicians or two similar bills confused.
- An announcement treated as a decision.

Model choice, from the trial and the archive runs:

- gpt-5.6-sol for research and tracing. In the trial it found evidence that gpt-5.6-terra missed.
- gpt-5.6-luna for mechanical restructuring of existing data.
- Plain scripts wherever the rule is deterministic, such as social account extraction.
- A second model can check a trace and flag disagreements for review, but it does not replace review.

The measure of the AI pipeline is review time per event. If review takes too long to sustain weekly, fix the pipeline or cut scope before publishing more.

## Publishing

### Website

- Language: German.
- A page per promise with original wording, competence, done-when, adoption, status, timeline and corrections.
- Browse by state, party, coalition and topic.
- Topic subscriptions, such as a housing update.
- A form where readers submit missing evidence. Submissions enter the same review queue as AI proposals.
- A methodology page that covers the status vocabulary, splitting rules, selection rule, source priority, the role of AI and the correction process.
- A public correction log.

### Weekly posts

- Content: what advanced, what was implemented, what was blocked, abandoned or reversed, and which deadlines passed. Every item links to its promise page.
- A week with no material change gets a post that says so.
- Only reviewed events appear in posts.
- No party score or percentage.
- Format: a short thread or share-image cards, for example "3 promises moved forward, 1 dropped", adapted per platform.

## Legal and compliance

Not legal advice. Have a lawyer check this before launch.

- **Defamation.** A false statement about a politician or party can fall under §186 and §187 StGB. Human review and exact sourcing are the main protection.
- **Media law.** The site is likely journalistic-editorial content under §18 MStV. That brings a duty of care and a named responsible person, on top of the Impressum under §5 DDG.
- **EU AI Act, Art. 50.** AI-generated text published to inform the public on matters of public interest needs a disclosure, unless a human reviews it and someone holds editorial responsibility. The review step is how this project meets the rule. Still say on the methodology page how AI is used.
- **Copyright.** Laws, Drucksachen and similar official works are generally free to use under §5 UrhG. Quote social posts under §51 UrhG with attribution. Check the terms for parliament video before embedding or clipping.
- **GDPR.** Keep personal data from reader submissions to a minimum. Public statements by politicians in their official role are the core material, but store only what the tracker needs.
- **Platform terms.** Scraping X, Instagram or Facebook breaks their terms. Prefer official APIs, or treat social media as manual leads.

## Roadmap

Each phase ends on its completion criterion.

### Phase 0: archive every party, before 20 Sep 2026

No state has a coalition yet, so any party could end up governing. Archive the core parties in all three states in full: programs, lead candidates, official websites and social accounts, election results, and coalition statements. Keep a basic record for every other admitted party. Add Sondierungspapiere and coalition agreements as they appear. Store everything in the format in `docs/archive-format.md`, with timestamped captures and sources for every fact, so silent edits by parties show up on re-fetch.

Done when every admitted party in all three states has a party file, every core party has a fact or a searched gap for each item, the validator passes, and `scripts/archive-fetch.ts` re-fetches all tracked URLs and reports changes.

### Phase 1: five-promise trial

Done on 17 Sep 2026. Five promises per state from the previous term, each traced independently by two models instead of by hand. The findings are in `docs/reports/trial/2026-09-17-trial-comparison.md`, and the decisions they led to are in "Core model" above. The trial statuses have not been reviewed by a person.

### Phase 2: lock the model and method

The trial findings are applied to "Core model". Still open: the selection rule and the public methodology page.

Done when the brief and the methodology draft agree and no open decision below blocks Phase 3.

### Phase 3: source pipeline

Build in this order: Berlin XML ingest, PADOKA scraper, budgets and gazettes, Anfragen, transcripts. Social media comes last and only as leads.

Done when new documents from each built source arrive in the review queue within one day of publication.

### Phase 4: site with 20 to 30 promises per state

Build the promise pages, review workflow, methodology page and correction log. Load 20 to 30 reviewed promises per state.

Done when every visible status links to a reviewed event with a stored source.

### Phase 5: weekly posts and growth

Start the weekly posts. Grow toward the full program, around 100 promises per party. Add topic subscriptions and reader submissions.

Done when four consecutive weekly posts have gone out with review, and review time per week is sustainable.

## Open decisions

- Tech stack and hosting.
- Project name. It should not name a single party.
- Selection rule if we track fewer promises than a full program.
- How far to track opposition programs beyond their motions and votes.
- Legal entity and the responsible person for Impressum and §18 MStV.
- Election results and coalitions for all three states, to be added to Scope.

## Glossary

| German | Meaning here |
|---|---|
| Wahlprogramm | Party election program, the source of promises. |
| Sondierungspapier | Exploratory-talks paper before coalition negotiations. |
| Koalitionsvertrag | Coalition agreement, the source of coalition commitments. |
| Landeskompetenz | Matters a state can legislate or act on itself. |
| Drucksache | Printed parliamentary paper: bills, motions, answers. |
| Plenarprotokoll | Official transcript of a plenary session. |
| Kleine / Große Anfrage | Written questions to the government by MPs or parliamentary groups. |
| Haushaltsplan | State budget. |
| Gesetz- und Verordnungsblatt | Official gazette where laws and regulations are published. |
| PARDOK / PADOKA | Parliament documentation systems of Berlin and Sachsen-Anhalt. |
| Landtag MV | The Landtag of Mecklenburg-Vorpommern in Schwerin. |
| Brandmauer | The other parties' policy of refusing to cooperate with the AfD. |
