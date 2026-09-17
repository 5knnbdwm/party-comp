# Sachsen-Anhalt promise trial: gpt-5.6-sol

Mode: `select`  
Trace date: 17 September 2026

## Scope and source basis

The captured agreement identifies the term as 2021-2026 on page 1 and is signed on page 158 in Magdeburg on 13 September 2021 by the state leaders of CDU, SPD and FDP. I therefore treated 13 September 2026 as the five-year deadline where the agreement says "binnen fünf Jahren".

The coalition agreement and all three 2021 election programs were captured successfully. The required Wayback submissions were attempted, but the service returned HTTP 500 for the agreement, CDU and SPD documents and HTTP 429 for the FDP document. The local captures are complete and are the sources used here.

The selection deliberately covers five topics and five evidence problems:

| Kind | Promise | Topic |
|---|---|---|
| Measurable | At least 7,000 active police officers within five years | Internal security |
| Law | Enact a Tariftreue- und Vergabegesetz by mid-2022 | Procurement and labor standards |
| Budget | Fund Kulturstiftung Sachsen-Anhalt with at least EUR 16.5 million annually from 2022, adjusted each year | Cultural heritage |
| Vague | Deprive extremism, racism and antisemitism of their basis | Democracy |
| Federal | Submit a Bundesrat initiative for parent-independent, non-repayable BAföG | Student finance |

## 1. At least 7,000 active police officers

**Status: `partially_implemented`.** An Interior Ministry release reports an increase from 5,822 officers to about 6,400 on 1 April 2025. A second release from 26 February 2026 says the 7,000 minimum target remains in force. No captured source gives a count at the 13 September 2026 deadline.

The done-when follows the agreement literally: at least 7,000 sworn police officers must be in active service by 13 September 2026. It excludes trainees because the agreement says "im aktiven Dienst". All three parties had proposed 7,000 officers, so adoption is `adopted`.

The decisive sources are captures `cap_20260917T104629309Z_94cbcb68` and `cap_20260917T104639163Z_8c9a3acd`. The first has the only exact active-service count found; the second shows that the target had not been retired. The search weakness is recency: official releases reported appointments and trainees in 2026 but did not state the active-service total at the deadline.

Before publication, a person should obtain the headcount for 13 September 2026 or the nearest reporting date, verify whether full-time equivalents or heads are counted, and confirm that the ministry's PVB definition matches the agreement.

## 2. Tariftreue- und Vergabegesetz

**Status: `approved`, with the deadline missed.** The coalition groups introduced the bill on 12 May 2022. The enacted law is dated 7 December 2022 and took effect on 1 March 2023. It contains tariff-loyalty rules and a procurement-specific minimum hourly wage.

The done-when requires passage of a state procurement law containing both substantive elements, not merely a bill with the promised title. The agreement required enactment by mid-2022, which I represented as 30 June 2022. The bill was introduced before that date but the law was passed more than five months later.

Adoption is `changed`. The SPD program called for a tariff-loyalty law and a EUR 13 procurement minimum wage. CDU wanted to replace the state law with federal procurement law, while FDP emphasized simplification. A single aggregate adoption value cannot express that the coalition largely adopted one party's policy while combining it with the other parties' deregulatory preferences.

The decisive records are PADOKA bill capture `cap_20260917T104629626Z_a7f4d362`, the official annotated law `cap_20260917T104630038Z_1113ecbb`, and the official overview `cap_20260917T105030386Z_73ef053f`. The current official law sources were accessible. The main difficulty was not discovery but deciding how closely statutory exceptions and the representative-tariff mechanism match the broad coalition wording.

Before publication, a lawyer or procurement specialist should check sections 11 and the relevant exceptions, confirm the enactment and commencement dates against the gazette, and approve the conclusion that the substance is close enough. An editor should also confirm that `approved`, rather than `implemented`, is the intended label when passage itself is the promise.

## 3. Kulturstiftung Sachsen-Anhalt operating grant

**Status: `approved`.** The adopted 2022 budget appropriated EUR 16.8828 million for operating institutional funding. The 2025/2026 budget records EUR 19.1888 million actual funding in 2023 and appropriations of EUR 22.4209 million in 2024, EUR 23.2936 million in 2025 and EUR 23.4901 million in 2026. Every figure exceeds the EUR 16.5 million floor and rises from the preceding observed year.

The done-when requires each budget from 2022 through 2026 to provide at least EUR 16.5 million and later annual figures to rise in line with the promised adjustment. This is one reasonable reading. A stricter reading would require proof of the exact tariff and price formula and actual disbursement, not just appropriations. The promise says the partners will "versuchen" to secure the funding, which also softens the commitment, but I did not reduce the numerical test because the agreement supplies a precise floor.

No governing-party program contained this specific funding commitment, so adoption is `not_in_programs`. The schema has no field for party-by-party negative findings; the empty `program_sources` array and an open question carry that result.

The decisive records are the 2022 budget capture `cap_20260917T105025958Z_231b9ee6`, the 2022 adoption report `cap_20260917T105107548Z_0e6c6937`, the 2025/2026 budget `cap_20260917T104708380Z_81967cce`, and the 2025 adoption report `cap_20260917T105030125Z_5cfe5750`. The old 2022 and 2024 file paths returned 404. The current ministry archive exposed a replacement API URL for the 2022 plan. The combined 2025/2026 PDF has 3,365 pages, making direct browsing slow; text search located the foundation table on PDF page 2,812.

Before publication, a person should verify the 2024 final outturn, the 2025 and 2026 disbursements, and the adjustment formula. The review should also decide whether a series mixing `Ist` and `Soll` merits `approved` or `partially_implemented`.

## 4. Counter extremism, racism and antisemitism

**Status: `not_assessable`.** The promise names an enduring social aim but no bounded action, metric, target state or deadline.

The done-when is deliberately `null`. Measuring spending, projects, prosecutions or attitudes would replace the promise with a narrower one that the coalition did not make. All three party programs contain comparable opposition to extremism, so adoption is `adopted`. Competence is `mixed`: the state controls policing and much prevention funding, but municipalities, the federal government and civil society also affect the stated outcome.

The agreement itself is decisive. Implementation documents cannot cure the missing completion criterion. I therefore did not manufacture an event timeline for activities that could never prove the stated outcome. The adjacent sentence promises to make prevention work permanent and sustainable; that clause is more suitable for extraction as a separate promise.

Before publication, a person should approve the split boundary and confirm that the aspirational sentence should remain visible as `not_assessable`. If the prevention clause is extracted separately, it needs its own done-when and evidence review.

## 5. BAföG Bundesrat initiative

**Status: `announced`.** In April 2023 the science minister said the coalition still wanted to pursue parent-independent BAföG. In March 2026 Sachsen-Anhalt voted for a BAföG reform resolution, but the official voting record lists Niedersachsen and Mecklenburg-Vorpommern as applicants and six other states as joiners. Sachsen-Anhalt is in neither list. The resolution itself seeks higher support, simplification and digitization, but not parent-independent aid or an end to repayment.

The done-when is state action within federal lawmaking: Sachsen-Anhalt must formally submit or join a Bundesrat initiative containing both promised reform goals. It does not require the federal reform to pass. SPD proposed abolition of repayment and FDP proposed parent-independent BAföG; no matching CDU program commitment was found. The coalition combined the SPD and FDP positions and added the Bundesrat mechanism, so adoption is `changed`.

The decisive sources are plenary protocol capture `cap_20260917T104631943Z_0a78f777`, Sachsen-Anhalt's official Bundesrat voting record `cap_20260917T104633121Z_014b6927`, and Bundesrat Drucksache 25/26 `cap_20260917T104633428Z_45b3924a`. A ministry article found in search returned 404 when captured. PADOKA and general searches did not establish the nonexistence of every earlier initiative, so the finding remains bounded to the official records located.

Before publication, a person should search Bundesrat records for the entire term by applicant and joiner, not only by title, and confirm that no earlier Sachsen-Anhalt filing contained both elements. The editor must also decide whether voting for another state's narrower resolution deserves `partially_implemented`; I used `announced` because it fulfills neither the formal filing test nor either substantive test.

## Where the draft model did not fit

Several model edges appeared in this trial:

- A missed deadline has no structured field or event. The procurement law can be `approved` while late, but lateness survives only in prose.
- `approved` and `implemented` overlap when enactment is itself the done-when. The vocabulary directs passed laws to `approved`, even though the completion test is met.
- One aggregate adoption value cannot represent a three-party compromise. The procurement promise was adopted from SPD, opposed in form by CDU, and reshaped by FDP concerns.
- `program_sources` cannot record a checked-but-absent result for each party. An empty array is indistinguishable from research not yet done without prose.
- A multi-year budget series mixes actual expenditure and appropriations. The status model has no first-class distinction between approved money, committed money and cash paid.
- Event types lack `parliamentary_vote` or `federal_state_action`. The Bundesrat vote had to use `other`.
- Competence alone cannot distinguish control over filing a Bundesrat initiative from control over the resulting federal law.
- Exact PDF quotes preserve line numbers, two-column interleaving and end-of-line hyphenation. The current schema validates fidelity but does not hold a reader-friendly normalized rendering beside the exact quote.
- `deadline` is an unconstrained string. Relative wording such as "within five years" requires an editorially chosen anchor date.
- The available publisher types do not cleanly distinguish a Bundesrat record from a state government or state parliament source.

## PADOKA search and automation notes

The Landtag's PADOKA introduction is at `https://www.landtag.sachsen-anhalt.de/dokumente/neue-doku`; it links to the database at `https://padoka.landtag.sachsen-anhalt.de/portala/start.tt.html`. The interface supports searches for proceedings, documents, laws, speeches and members. Advanced fields use autocomplete or indexes and can be restricted by electoral term. A known document number such as `8/1159` is the quickest route.

Public documents are PDFs. A confirmed direct Drucksache URL has the form:

`https://padoka.landtag.sachsen-anhalt.de/files/drs/wp8/drs/d1159rge.pdf`

The path encodes the electoral term and document number, but suffixes such as `rge` should be taken from PADOKA links rather than guessed. Plenary material is less consistent: the protocol used here was served from a Landtag `fileadmin/user_upload` URL. Current Landtag session pages also expose HTML transcripts through query parameters, which can help discovery but are not a substitute for the final protocol.

No documented API or bulk export was found. PADOKA's stateful search interface, inconsistent document hosts and suffixes make link harvesting more reliable than constructing URLs. The PDFs themselves are searchable, but two-column layouts interleave text and many documents retain print hyphenation. Search-engine indexing was useful for leads, not for proving exhaustive negative findings. Automated collection should retain PADOKA metadata and the linked PDF URL together.

## Publication review summary

Every status, done-when, adoption link and event still requires human sign-off under the project brief. The highest-risk judgments are the police cutoff count, legal equivalence of the procurement provisions, appropriation versus payment for culture funding, the decision not to operationalize the vague extremism goal, and exhaustive proof that Sachsen-Anhalt never filed or joined the promised BAföG initiative.
