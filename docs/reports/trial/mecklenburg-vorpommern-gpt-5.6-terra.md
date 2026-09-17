# Mecklenburg-Vorpommern trial trace, gpt-5.6-terra

Mode: `trace`. Traced on 17 September 2026.

The selected coalition agreement is headed "Koalitionsvereinbarung zwischen SPD und DIE LINKE. Mecklenburg-Vorpommern für die 8. Legislaturperiode 2021-2026" on its text pages. Its signatures are dated 13 November 2021. That confirms the governing parties, SPD and DIE LINKE, and the 2021-2026 term.

## 1. 1,000 school posts

Status: `implemented`. A November 2024 plenary record says that 1,167 people had been newly hired or had posts made permanent through the "1.000 Stellen besetzen, sichern, erweitern" programme.

I set the done-when to 1,000 posts filled within the term. The agreement gives a number, a named programme, a term and a list of staff categories, so a numerical test is possible. Its phrase "Stellen besetzt" is narrower than the later plenary statement, which combines new hires with posts made permanent. That is the one material ambiguity.

The useful sources were the Landtag plenary records. The June 2022 supplementary-budget debate records that the programme would fill, make permanent and expand 1,000 posts. The 13 November 2024 record supplies the decisive 1,167 figure. These are searchable PDFs from `dokumentation.landtag-mv.de/parldok/dokument/<id>/...`; the full-text PDF made this straightforward once the document ID was known. Before publication, a person should obtain a ministry staffing return that breaks down the 1,167 people by programme category and confirms that permanent posts count toward the 1,000 target.

The coalition commitment is a changed adoption of DIE LINKE's proposal for an additional teacher at each school. I found no SPD programme wording that commits to this 1,000-post programme.

## 2. Make 8 March a statutory holiday

Status: `implemented`. The official gazette contains the enacted amendment adding "der Frauentag (8. März)" to the list of holidays, with entry into force the day after promulgation.

The done-when is deliberately legal: the statute must list 8 March and the amendment must be in force. The coalition wording gives exactly that result, so there is little room for a second reading.

The strongest material is the bill, Drucksache 8/404, and GVOBl. M-V no. 31/2022. Both are text PDFs. The bill explicitly says it implements the coalition agreement. The gazette establishes the enacted wording. A reviewer should check the gazette's publication record and the first actual public holiday date, though that extra step does not affect the legal status.

This is an adopted SPD programme commitment. I found no matching promise in the captured DIE LINKE programme.

## 3. Senior ticket at one euro per day

Status: `reversed`. The state launched a senior Deutschlandticket at 29 euros per month in August 2023. A July 2026 ministry statement gives the current price as 43 euros per month.

The done-when requires a senior ticket for eligible residents at no more than 365 euros per year, while local public transport in Mecklenburg-Vorpommern remains covered. The agreement gives both the ticket and the one-euro-per-day price. At launch, 29 euros times 12 was 348 euros. In July 2026, 43 euros times 12 was 516 euros. The ticket survived but the price condition did not. That is why I used `reversed`, even though the reversal is only one part of the compound promise.

The launch page on the state government portal is the decisive source for the cabinet presentation, start date and 29-euro price. The transport ministry's 2 July 2026 release is decisive for the 43-euro price. Both are readable HTML captures. The report refers to a Landtag implementation report, but its linked PDF was not separately captured in this trace. A reviewer should capture that report, identify the tariff decision and date of the increase, and confirm that the ticket was available continuously to every eligible resident.

This is an adopted SPD programme commitment. I found no matching commitment in the captured DIE LINKE programme.

## 4. Leading location for climate-neutral business

Status: `not_assessable`. A 2024 government answer reports three certified green business parks, but the coalition agreement never defines what would make the state "one of the leading locations".

There is no defensible done-when. The sentence has no comparator group, ranking method, target value or date. Turning three parks, a particular investment total or climate neutrality by 2040 into a target would be inventing a promise. The selected wording does name green business parks as one means, not as a completion criterion.

The relevant sources are an SPD and DIE LINKE Landtag motion from February 2022 and the government's answer to Kleine Anfrage 8/4185 of 24 October 2024. The motion repeats the goal and calls for green business parks. The answer says three are certified, none are in the application process and preliminary checks are underway at two locations. Both documents are text PDFs on the Landtag documentation site. A reviewer should decide whether this broad commitment belongs on a public tracker at all. If it does, the page must state that the status reflects unassessable wording, not a judgement on climate policy.

The coalition commitment adopts both parties' broader climate-neutral-economy commitments. It narrows neither party's climate date into a usable test for this specific location claim.

## 5. Support a nationwide minimum wage of 12 euros

Status: `no_evidence_found`. The Federal Ministry of Labour confirms that the nationwide minimum wage rose to 12 euros on 1 October 2022, but the captured evidence does not show an action by this state coalition to support it.

The done-when is a documented action by the coalition in a federal legislative or Bundesrat process. "Unterstützen" describes conduct by the coalition, rather than merely the federal result. This distinction matters because wage legislation is federal competence. Treating the federal outcome as delivery by the state would hide who actually acted.

The available source is the BMAS release of 3 June 2022. It is readable HTML and directly establishes the federal law's content and effective date. It also attributes the increase to the federal coalition agreement, not to Mecklenburg-Vorpommern. A reviewer should search Bundesrat papers, state government releases and Landtag material for a Bundesrat vote, a state initiative or a recorded statement. If none exists, the public page should retain `no_evidence_found`, not imply failure because the competence lies elsewhere.

This is an adopted SPD programme commitment. The captured DIE LINKE programme says the minimum wage is inadequate but does not commit to 12 euros.

## What the draft model did not cover well

The senior-ticket result is the clearest gap. The ticket was implemented at the promised price and later became more expensive, while the service itself continued. `reversed` is available, but it reads as if the whole promise disappeared. A field for fulfilled and later no longer fulfilled components, or an event-level status, would describe this more honestly.

The schools promise exposes another gap. The agreement measures positions, while the plenary evidence counts people newly hired or whose posts were made permanent. The model has no field for the source's measurement unit or an explicit conversion judgement. It should.

The minimum-wage promise shows that a federal-competence label alone is not enough. The model needs a rule for verbs such as "support", "work towards" and "advocate": does evidence of a state action count, does the external outcome count, or are both shown separately? I used state action because that matches the grammar of the commitment.

`not_assessable` works for the climate-economy wording, but the record still needs to show relevant events. The model permits this, although a reader can easily mistake those events for progress toward a test that does not exist.

## Landtag documentation system

The Landtag documents used here live at `https://www.dokumentation.landtag-mv.de/parldok/dokument/<numeric-id>/<document-slug>`. The tracked examples include both PDF URLs ending in `.pdf` and plenary-protocol URLs without a suffix that return PDFs. Document first pages identify their Drucksache number, session and date. The source material was machine-readable PDF text, so exact quotations and pages could be checked locally.

The hard part is discovery, not extraction. The visible document URLs carry an opaque numeric ID, and I did not identify a documented bulk export or public API during this trace. The homepage search is useful as a read-only discovery path, but query results and their URL patterns need a separate test before building an automated collector. Government pages supplied the senior-ticket evidence as HTML. The federal ministry page did the same for the minimum wage.

## Review needed before publication

- For the school programme, obtain an authoritative final staffing table and check whether permanent posts are included in the 1,000-post count.
- For the holiday, check the gazette publication record and first observance date.
- For the senior ticket, capture the linked Landtag report, establish the price-change date and confirm statewide availability through the term.
- For the climate commitment, decide whether an unassessable aspiration should be tracked and make that limitation prominent if it is.
- For the minimum wage, search the Bundesrat and state records for evidence of the coalition's own action.
