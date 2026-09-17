# Mecklenburg-Vorpommern promise trial

Mode: `select`  
Model: `gpt-5.6-sol`  
Trace date: 17 September 2026

## Sources and term

The captured agreement names the SPD state association and parliamentary group, and the Die Linke state association and parliamentary group, as the parties forming the coalition government. Its cover and agreement page identify the eighth legislative term as 2021-2026. I therefore used SPD and Die Linke as the governing parties and 2021-2026 as the previous term.

The coalition agreement and SPD program came from the SPD Mecklenburg-Vorpommern site. The adopted Linke program came from the party's `originalsozial.de` host. Direct links to two older Linke copies returned HTTP 404 before the adopted copy was found. The required Wayback requests were made for all three source documents. The service returned HTTP 500 for the coalition agreement and both successful program captures, so the `wayback_url` fields are empty. The local PDF captures are complete.

## 1. One thousand school posts

**Status: `implemented`.** In the 13 November 2024 plenary protocol, Education Minister Simone Oldenburg said that 1,167 people had been newly hired or their posts retained under the program. The 2022 supplementary-budget debate also records money for the agreed program.

The done-when follows all three verbs in the program title: fill, retain and add. It therefore counts posts retained from the earlier school package as well as newly created or newly filled posts. It does not turn the promise into 1,000 additional teachers, because the agreement itself lists teaching, cover, vocational-school and other school-support categories.

The decisive source was plenary protocol 8/90, page 48. The protocol is searchable text, but its two-column layout interleaves sentences in the extracted text. The budget debate on protocol 8/27, page 28, confirms funding but does not isolate an amount for the 1,000-post program.

Before publication, a reviewer should obtain the program's administrative count. The minister counted people, while the promise says posts. The check should cover full-time equivalents, part-time appointments, retained posts and possible double counting. The SPD program promised needs-based teacher recruitment without a number. The Linke program promised one additional teacher per school. The coalition changed both into a 1,000-post program, so `changed` is the least misleading single adoption value.

## 2. International Women's Day as a public holiday

**Status: `implemented`.** The official gazette published the amendment that inserted "der Frauentag (8. März)" into the Public Holidays Act. The law took effect the day after promulgation.

The wording names the legal instrument and result, so the done-when is a state law in force that lists 8 March as a statutory public holiday. No broader equality outcome is required. The wording allowed little room for interpretation.

Drucksache 8/404 shows that the SPD and Die Linke groups introduced the bill on 23 February 2022. GVOBl. M-V 31/2022, page 3, is decisive because it contains the enacted text. Both PDFs have usable text layers and stable direct-document URLs.

Before publication, a reviewer should verify the promulgation and effective dates against the gazette header. The SPD program contains the same promise. I found no matching 8 March commitment in the Linke program, which proposed different additional public holidays.

## 3. Senior ticket for 365 euros a year

**Status: `implemented`.** The state launched a subsidized Deutschlandticket for residents aged 65 and over on 1 August 2023 at 29 euros per month. Twelve months cost 348 euros, below the promised 365 euros. The 2022 budget debate records state funding for the senior ticket alongside the trainee ticket and call-bus system.

The done-when treats "führen ... ein" as an introduction promise. The ticket had to become purchasable during the term at no more than 365 euros a year and require state funding. It did. The wording does not say that the nominal price must remain fixed for the whole term. This matters because a transport ministry report dated 2 July 2026 put the discounted ticket at 43 euros per month, with a 20-euro state subsidy per ticket.

The decisive source was the state government's launch page. It gives the eligibility rule, price, subsidy and start date. Plenary protocol 8/27 supplies the budget evidence, but the quoted 16 and 19 million euro figures group several transport measures and do not assign a clean amount to this ticket alone.

Before publication, a reviewer should decide whether the methodology treats an introductory price as enough or requires the promised price to persist. If persistence is required, the later increase could support `reversed`. The SPD program contains the same senior-ticket promise. I found no matching age-specific 365-euro commitment in the Linke program.

## 4. A leading location for climate-neutral business

**Status: `not_assessable`.** The government reported three certified green business parks in October 2024. That proves activity, not that Mecklenburg-Vorpommern became "one of the leading locations" for climate-neutral business.

There is no defensible done-when. The agreement gives no comparator group, ranking method, threshold or deadline. Counting certified business parks alone would silently replace the claim with a narrower promise. The sentence does contain that narrower, assessable subcommitment, but the selected claim is the leading-location outcome.

Drucksache 8/406 repeated the goal in a governing-group motion in February 2022. The government's answer to Kleine Anfrage 8/4185 is more useful. It names the three certified parks and says none were then in the formal application process, with preliminary checks in two places. Both records were easy to download as text PDFs.

Before publication, a reviewer should keep the overall promise `not_assessable` and decide whether to split out the green-business-park clause as its own promise. The SPD program discussed a climate-neutral economy and a 2040 climate-neutral state. The Linke program set a 2035 state target. The coalition recast those positions as a leading business-location claim, so I marked adoption `changed`.

## 5. Federal minimum wage of 12 euros

**Status: `implemented`.** The Federal Ministry of Labour records that the Bundestag approved the bill on 3 June 2022 and that the 12-euro statutory minimum wage took effect on 1 October 2022.

The done-when uses the promised federal outcome: nationwide law puts a minimum wage of at least 12 euros per hour into force during the term. Mecklenburg-Vorpommern could support that outcome but could not enact it. The wording leaves the state's required act undefined, so the evidence proves the outcome without proving a distinct causal act by the state government.

The BMAS page was the decisive source. It is concise HTML and easier to search than the federal legislative packet. The Landtag database did not produce a state motion or recorded state vote that would show what "support" meant here.

Before publication, a reviewer should decide whether an outcome outside state competence can be `implemented` without evidence of a concrete state action. The SPD program contains the same 12-euro federal target. I found no matching target in the Linke state program. Its 13-euro proposal concerned pay under state procurement rules.

## Where the draft model did not fit

The trial exposed several model problems.

- One adoption value cannot describe two-party ancestry well. The school promise combined a non-numerical SPD staffing goal with a different Linke unit. `changed` hides that structure.
- `implemented` has no time dimension. The senior ticket met the price on introduction, then rose above 365 euros. Whether that is still implemented or later reversed depends on a durability rule that the model does not state.
- A vague outcome can contain an assessable subcommitment. The climate-neutral-business sentence is not assessable as a ranking claim, while its green-business-park clause can be tracked. The model needs either explicit subpromises or a field for assessable actions beneath a vague outcome.
- Event types lack `law_in_force`, `service_launched` and a distinction between money proposed and money finally appropriated. I used `other` for the ticket launch and `budget_line` for a plenary budget statement.
- Counts need a unit and baseline. "People", "posts" and full-time equivalents are not interchangeable. A done-when field alone does not force that distinction into structured data.
- Federal support promises need a field for the state's required action. Otherwise a federal outcome can be credited even when no causal state act is found.
- A free-text deadline can record "end of term", but the model does not distinguish an explicit date from a deadline inferred from "in dieser Legislaturperiode".

## Searching the Landtag documentation system

The Landtag's documentation home page offers document-number lookup, date ranges, keywords, originator, parliamentary group, body, speaker, document kind, document type and procedural status. Searching exact phrases and known Drucksache numbers worked better than broad policy terms.

Direct documents use URLs shaped like `/parldok/dokument/<numeric-id>/<document-slug>`. The slug may end in `.pdf`, but several working direct links have no extension even though the response is a PDF. Drucksachen and plenary protocols in this trial had text layers. The two-column plenary layout causes `pdftotext -layout` to interleave the left and right columns, so quotations need a page check against the rendered PDF. Drucksachen were much cleaner.

I found no documented bulk API or export during this trial. The public form is usable without login, and direct documents did not block automated retrieval. Search-engine indexing was often the quickest way to discover a document, after which the Landtag URL could be fetched directly. Old party-document links were less reliable than parliamentary links.

## Human review before publication

- School posts: reconcile people, budgeted posts and full-time equivalents against the underlying program table.
- Public holiday: confirm the enactment and effective date in the gazette.
- Senior ticket: choose and publish a rule for price durability, then check the current and historical tariff.
- Climate-neutral business: keep the broad status unassessable or split out the green-business-park action before assigning a status.
- Minimum wage: decide what evidence of state support is required when the promised outcome is federal.

All five judgements remain proposals for human review. None should be published solely on this trace.
