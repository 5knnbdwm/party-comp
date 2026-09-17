# Berlin promise trial: gpt-5.6-sol

Mode: `select`  
Trace date: 17 September 2026

## Scope and source basis

The captured agreement names CDU and SPD in its preamble and labels itself `KOALITIONSVERTRAG 2023 - 2026` on the cover. I therefore treated CDU and SPD as the governing parties and 2023-2026 as the previous term.

The coalition agreement and the SPD program were captured from party or government hosts. The CDU program is the full 2021 Berlin Plan preserved by abgeordnetenwatch. Berlin's February 2023 election was a repeat of the 2021 House of Representatives election, and the CDU's 2023 election-program page identifies that plan as the program basis. The attempted direct CDU PDF returned HTTP 403, while an older CDU URL redirected to the party homepage. Those unusable captures remain in the append-only archive. Required Wayback submissions were attempted for the agreement and programs, but returned HTTP 500. The local PDF captures are complete and are the sources used in the trace.

The selection covers five topics and five evidence problems:

| Kind | Promise | Topic |
|---|---|---|
| Measurable | Buy one new Water Police steel boat every year from 2024 | Internal security |
| Law | Replace the General Jurisdiction Act and catalogue with a new administrative law | Administrative reform |
| Budget | Establish an initial EUR 5 billion climate special fund | Climate finance |
| Vague | Make Berlin one of Europe's most significant economic and technology locations | Economy and technology |
| Federal | Launch a Bundesrat initiative on threats against witnesses and court personnel | Criminal law |

## 1. One new Water Police steel boat each year

**Status: `approved`, with the annual target missed in 2024 and 2025.** A Senate answer says Police Berlin procured no steel boat in 2024 and could procure none in 2025 because no budget funds were available. The adopted 2026/2027 police budget then provided EUR 1.25 million in each year for police boats.

The done-when requires delivery of at least one new steel-hulled Water Police boat in each calendar year from 2024 through 2026. This is the most concrete reading of “jährlich ein neues Stahlboot anschaffen”, but procurement language leaves room for an order or signed contract to count instead of physical delivery. Either reading fails for 2024 and 2025 because the government answer says no boat was procured. The later budget line supports `approved`, not `partially_implemented`, because no captured evidence shows that any boat was ordered or delivered.

The CDU program promised modern Water Police boats, so adoption is `adopted`. No equally specific SPD program promise was found.

The decisive evidence is the written-answer capture `cap_20260917T111128311Z_065364d7` and budget capture `cap_20260917T111128609Z_db9e1f89`. The written answer is unusually clear. The budget is less conclusive: its line covers police boats generally, carries blocked commitment authorizations, and says procurement normally takes two years. It does not identify hull material or prove spending.

Before publication, a person should establish whether 2026 funds were released, contracted or spent, whether a boat was delivered before the term ended, and whether the budgeted boats were steel-hulled Water Police vessels. An editor should approve whether procurement means contract, purchase or delivery.

## 2. Replace the administrative jurisdiction framework

**Status: `implemented`.** The Senate introduced the Administrative Structure Reform Act in April 2025, the official gazette published the enacted law dated 10 July 2025, and the new State Organisation Act took effect on 1 January 2026.

The done-when is enactment and commencement of a law that replaces the old General Jurisdiction Act and jurisdiction catalogue with a framework for allocating tasks and cooperation between the Senate and districts. It does not require proof that administrative services became faster. The promise names a legislative replacement, while operational performance would be a separate outcome promise. I left the deadline `null` because “schnellstmöglich” gives urgency but no objective calendar date.

Both party programs supply precursors. CDU called for clear responsibilities between Senate and districts. SPD called for standardized services and systematic removal of duplicate responsibilities. The coalition commitment is therefore `adopted`.

The decisive records are bill capture `cap_20260917T111131402Z_369e75fb`, gazette capture `cap_20260917T111131993Z_07702e8b`, and government report `cap_20260917T111132393Z_7805a769`. The law package is long and technically layered. It uses a State Organisation Act, a comprehensive catalogue and implementing instruments rather than a single plain replacement document.

Before publication, a public-law reviewer should confirm that the enacted package legally replaces both instruments in the way the coalition wording requires. A reviewer should also keep the legal done-when separate from the government's continuing operational implementation during 2026.

## 3. EUR 5 billion climate special fund

**Status: `blocked`.** The Senate approved a EUR 5 billion special-fund bill on 25 July 2023 and submitted it to parliament on 3 August. An official committee report later said deliberations were paused after the Federal Constitutional Court's judgment of 15 November 2023, pending a legal opinion. No captured record shows the establishment law passing by the agreement's 2023 deadline or before the term ended.

The done-when requires a Berlin law establishing the named fund with an initial volume of EUR 5 billion. A cabinet decision or introduced bill is insufficient because neither creates the fund. The agreement elsewhere calls for the establishment act in 2023, so the trace records `2023` as the deadline.

No specific special-fund commitment was found in either governing-party program, making adoption `not_in_programs`.

The decisive evidence is the Senate release `cap_20260917T111133443Z_e7fbb1a0`, introduced bill `cap_20260917T111132742Z_fbc9d16f`, and committee report `cap_20260917T111132961Z_e5fda205`. The difficult judgment is causal. The court ruled on federal borrowing, not Berlin's bill directly, but parliament's own report says the judgment paused deliberations. That makes `blocked` a closer fit than leaving the promise at `proposed`.

Before publication, a person should determine whether the bill was later withdrawn, rejected or allowed to lapse, and whether ordinary-budget climate financing replaced it. A public-law specialist should confirm that `blocked` does not overstate the judgment's legal effect on Berlin.

## 4. Become a leading European economic and technology location

**Status: `not_assessable`.** The agreement provides no ranking, comparison group, sector boundary, metric or deadline that could establish completion.

The done-when is deliberately `null`. Selecting patents, technology employment, venture funding, gross value added or a city ranking would create a narrower promise the coalition did not make. The CDU program proposed making Berlin a leading global research location in several technology fields. The SPD program aimed for national and European competitiveness and global leadership in digitization and artificial intelligence. Adoption is therefore `adopted`.

The coalition agreement itself is decisive. Implementation documents cannot resolve the missing completion test, so the trace contains no event timeline. The adjacent sentences on supporting existing businesses and attracting companies may be suitable for separate extraction, but they should not be used as proxy measures for this ambition.

Before publication, a person should approve the promise boundary and the decision to expose it as `not_assessable`. If adjacent actions are extracted, each needs its own done-when and evidence review.

## 5. Bundesrat initiative on threats to witnesses and court personnel

**Status: `implemented`.** Bundesrat paper 449/24 says the Berlin Senate resolved on 10 September 2024 to submit the matching Criminal Code and Criminal Procedure Code amendment concerning threats against witnesses and court personnel.

The done-when is Berlin's formal submission of the draft to the Bundesrat. The promise is to launch an initiative, not to secure passage by the Bundestag. Federal enactment is outside Berlin's control and is not required for completion.

No specific matching commitment was found in either governing-party program, so adoption is `not_in_programs`.

The decisive source is the federal paper capture `cap_20260917T111250630Z_294ef690`. Berlin's official initiative list, captured as `cap_20260917T111134119Z_38438e35`, was useful for discovery and corroboration, but the submitted paper gives the stronger primary evidence. Federal records were easier to search by known paper number than by the coalition's wording.

Before publication, a person should confirm the formal Bundesrat procedure and decide whether readers also need the later federal outcome. That outcome matters to policy impact but should not alter this filing-based status.

## Where the draft model did not fit

- A missed deadline has no structured status or event type. The boat promise can move to `approved` after two annual targets were missed, while the failures survive only in the government-answer event and prose.
- `approved` describes the furthest procedural stage for the boats, even though approval of generic boat funding satisfies none of the annual delivery done-when. The vocabulary mixes progress stages with completion judgments.
- A recurring annual target has no first-class representation. One missed year makes the literal boat promise permanently incomplete, even if later years deliver several boats.
- The model cannot distinguish appropriated, released, contracted, spent and delivered money or equipment. These distinctions decide the boat status.
- `implemented` is natural for the administration law because enactment and commencement are the done-when, although the brief warns that laws are only `approved` when the promised outcome lies beyond passage.
- `blocked` does not distinguish a direct adverse court order from a government or parliament pausing work because of a judgment in another case.
- `program_sources` cannot record that each party program was checked but lacked a match. An empty array could also mean that research was not done.
- One adoption value loses party-specific differences and does not express that the repeat 2023 election relied on programs originating in 2021.
- Competence does not distinguish Berlin's control over submitting a Bundesrat initiative from federal control over enacting it.
- `deadline` is an unconstrained string. It cannot distinguish a calendar deadline from a recurring period or vague urgency such as “schnellstmöglich”.
- Exact PDF quotes preserve line breaks, spacing, print hyphenation and occasional extraction artifacts. The model has no normalized display text beside the audit quote.

## PARDOK search and automation notes

Berlin's parliamentary documentation is split across several official hosts and URL patterns:

- Plenary Drucksachen use paths such as `https://www.parlament-berlin.de/ados/19/IIIPlen/vorgang/d19-2353.pdf`.
- Committee records use paths such as `https://www.parlament-berlin.de/adosservice/19/Haupt/vorgang/h19-1599-v.pdf`.
- Written questions can use the legacy Starweb path `https://pardok.parlament-berlin.de/starweb/adis/citat/VT/19/SchrAnfr/S19-22511.pdf`.

The official open-data page at `https://parlament-berlin.de/dokumente/open-data` provides daily updated XML metadata for Drucksachen, plenary and committee protocols, and written questions. It is the best automation entry point because it avoids replaying the stateful Starweb search form. Known document numbers are also effective in the search form and in web search.

The substantive records used here are searchable PDFs. Direct URL construction is still fragile because document class and committee determine the host and path, and older written questions remain on Starweb. Search-engine results sometimes favored lobby-register or press pages over the parliamentary record. The XML should therefore supply canonical links rather than a scraper guessing them. PDF text is generally usable, but long laws contain multi-column layouts, irregular spacing and line-end hyphenation that require page-aware quote validation.

The official gazette and budget are on Berlin government hosts, not PARDOK. The 2026/2027 police budget is a 458-page volume, so text search is much faster than browsing. Government press pages are easy to capture as HTML and often state commencement or cabinet dates plainly, but they should corroborate rather than replace the enacted law or parliamentary paper.

## Publication review summary

Every done-when, adoption link, event and status still requires human approval under the project brief. The highest-risk checks are:

- **Steel boats:** define the procurement milestone, verify 2026 execution and hull or fleet scope, and decide whether `approved` communicates two missed annual targets clearly enough.
- **Administrative law:** confirm legal equivalence between the promise and the enacted package, while separating commencement from operational results.
- **Climate fund:** establish the bill's final disposition and review whether the indirect court-related pause merits `blocked`.
- **Economic and technology location:** approve the extraction boundary and refusal to invent a metric.
- **Witness-threat initiative:** verify the formal filing and keep the later federal outcome separate from Berlin's completed action.

The report and trace should not be published until those reviews are recorded. The strongest factual findings are the two years without a steel boat, commencement of the administrative law, the documented pause of the climate-fund bill, absence of a defensible test for the location ambition, and Berlin's formal Bundesrat submission.
