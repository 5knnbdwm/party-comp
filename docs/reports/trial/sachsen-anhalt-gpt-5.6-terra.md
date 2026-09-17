# Sachsen-Anhalt trial trace, gpt-5.6-terra

Trace mode. I used the five commitments in `selection.json` and did not inspect the other trace or report. The captured coalition agreement is headed "Koalitionsvertrag 2021 - 2026" and says that CDU, SPD and FDP formed the jointly supported state government (cap_20260917T104206450Z_5dbf6f91, pages 1 and 3).

## Five promises

### 7,000 police officers

**Status: `partially_implemented`.** The Interior Ministry reported about 6,400 active police officers on 1 April 2025 and later repeated the 7,000 minimum target (cap_20260917T104629309Z_94cbcb68, page 1; cap_20260917T104639163Z_8c9a3acd, page 1).

I treated the wording as a headcount commitment, not a commitment to fund 7,000 posts. That follows "im aktiven Dienst" in the agreement. CDU, SPD and FDP had compatible 7,000 commitments in their programmes. The five-year deadline makes an end-of-term count decisive. I found no official final count. A reviewer should obtain it before publication and check whether trainees or temporarily absent officers count as active service.

The decisive source was a ministry press release with a dated stock figure. It is a PDF and easy to search after capture. The weak spot is that it is nearly a year before the end of the five-year period.

### Tariftreue and procurement law

**Status: `implemented`.** The coalition factions introduced the bill on 12 May 2022, and the official explained version identifies the TVergG LSA as of 7 December 2022 in the state gazette (cap_20260917T104629626Z_a7f4d362, page 1; cap_20260917T104630038Z_1113ecbb, page 1).

The selected sentence commits to drafting and passing a law, so the done-when is a passed law in force. It does not require every proposed procurement detail to survive unchanged. The agreement said "by mid-2022". The law came later, so the deadline miss belongs in the timeline even though the law was ultimately delivered. The matching programme source is SPD's stated aim of a Tariftreue- und Vergabegesetz.

The bill and the consolidated explanatory PDF are straightforward documents. Before publication, a reviewer should check the gazette's promulgation and commencement provisions, then compare the enacted provisions with the agreement's separate promises on tariffs, minimum pay and thresholds.

### Kulturstiftung Sachsen-Anhalt funding

**Status: `implemented`.** The enacted 2022 budget set EUR 16,882,800 for title 685 74, "Zuschüsse für laufende Zwecke". The enacted 2025/2026 budget set EUR 23,293,600 for 2025 and says its commitment authority finances tariff and operating-cost increases (cap_20260917T105025958Z_231b9ee6, page 2541; cap_20260917T104708380Z_81967cce, page 2813).

No captured governing-party programme contains this particular foundation-financing commitment, so its adoption is `not_in_programs`. I read "Grundfinanzierung" as the recurring operating subsidy, not the much larger mix of capital spending and federal programme funding. The 2022 amount clears the EUR 16.5 million threshold. Later budget lines rose and expressly mention tariff and operating costs. That is enough for the selected funding test, though it does not prove a formula tied to the whole price index.

The budget PDFs have an extractable text layer but are enormous. The line item is buried in the cultural budget chapter. A reviewer should check the 2023 and 2024 annual budgets, the approved foundation budgets, and the financing agreement before publishing a claim that every yearly adjustment followed tariff and price changes.

### Countering extremism, racism and antisemitism

**Status: `not_assessable`.** The 2026 government balance reports collaboration and a strengthened state programme for democracy, diversity and openness (cap_20260917T104330199Z_0a7d0563, page 27), but the promise has no observable completion point.

The wording says the government will work to deprive every form of extremism, racism and antisemitism of its basis. It gives no measure, minimum coverage or date. I did not turn the follow-up sentence on prevention into a numerical target. SPD's programme contains a narrower related commitment to oppose racism, antisemitism and right-wing extremism, so the adoption is `adopted` in substance.

The government balance is easy to search after capture, but it is self-reporting and cannot settle a claim this broad. A reviewer should decide whether to split out the agreement's more specific commitments on prevention, programmes and funding. This one should remain unassessable.

### BAföG Bundesrat initiative

**Status: `no_evidence_found`.** A March 2026 Bundesrat record names Lower Saxony and Mecklenburg-Vorpommern as applicants for a BAföG reform resolution. Sachsen-Anhalt's minister gave a speech, but the record does not identify Sachsen-Anhalt as an applicant (cap_20260917T104633121Z_014b6927, page 5).

The done-when follows the verb "einbringen": Sachsen-Anhalt must introduce a Bundesrat initiative with the two stated reform goals. SPD's programme called for a basic BAföG reform without repayment, but the coalition agreement adds a specific federal route and parents-independent support. That is `changed`, not a simple adoption.

The state representation's PDF is a useful negative lead, not proof that no initiative exists. A reviewer must search the full Bundesrat document database for Sachsen-Anhalt as applicant or co-applicant, then compare any found text to both requested reforms.

## What did not fit cleanly

The draft status vocabulary handles the result well, but two edges matter. `implemented` can coexist with a missed explicit deadline, as with the procurement law. The event model has no natural type for evidence that a proposal was made by other states rather than Sachsen-Anhalt. I used `other` for the BAföG record and spelled out why it is not delivery.

`not_in_programs` is useful for this trial's coalition-first records, but it is not in the brief's party-promise adoption vocabulary. The foundation commitment also shows why the data model should distinguish a coalition-only commitment from a many-to-many programme link with no match.

The culture case exposes another gap. A budget can prove an appropriation but not necessarily payment or a stable annual indexation rule. The model could benefit from an explicit distinction between a budgeted input and money actually spent, especially for commitments framed as continuing funding.

## PADOKA and source access

PADOKA documents use predictable direct PDF paths in the captured example: `https://padoka.landtag.sachsen-anhalt.de/files/drs/wp8/drs/d1159rge.pdf`. This is a Drucksache PDF for Wahlperiode 8, document 1159. The Landtag's current-documents page links PADOKA, but the brief correctly treats it as a scraper problem because there is no known API or bulk export.

The direct PDFs have searchable text layers. The harder part is discovery: a document number and suffix in the URL do not tell a researcher which question, bill or answer is relevant. Results need a captured landing page or search result alongside the PDF so a reviewer can verify title, date and parliamentary process. Large budget PDFs are searchable but unwieldy, and their physical PDF page numbers are much higher than the printed page numbers in the budget chapter.

## Review checklist

- Police: obtain an official end-of-term active-PVB count and resolve the definition of active service.
- Procurement: verify promulgation and commencement in the official gazette, then separate the law's existence from its substantive clauses.
- Culture: check 2023 and 2024 budgets, the foundation's approved budgets and the financing agreement for the price-adjustment claim.
- Counter-extremism: decide whether to split concrete prevention promises out of the unassessable umbrella wording.
- BAföG: search the complete Bundesrat record for Sachsen-Anhalt as applicant or co-applicant, then compare the initiative's text with both coalition goals.
