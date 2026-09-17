import { z } from 'zod';
import { readCaptures, root } from './archive-fetch';
import { captureTexts, quoteFound } from './archive-quotes';
import { state, type Capture } from './archive-schema';

// Checks the Phase 1 trial files in data/trial/<state>/: shapes, captures and quotes.
// Usage: bun scripts/trial-check.ts <state>

const source = z.strictObject({capture:z.string(), quote:z.string().min(1), page:z.number().int().positive().nullable()});
const selectionSchema = z.strictObject({
 state,
 coalition_agreement_capture:z.string(),
 promises:z.array(z.strictObject({id:z.string(), kind:z.enum(['measurable','law','budget','vague','federal']), quote:z.string().min(1), capture:z.string(), page:z.number().int().positive().nullable()})).length(5),
});
// Status vocabulary from docs/project-brief.md.
const statuses = ['not_assessable','no_evidence_found','announced','proposed','approved','partially_implemented','implemented','blocked','abandoned','reversed'] as const;
const traceSchema = z.strictObject({
 state,
 mode:z.enum(['select','trace']),
 model:z.string().min(1),
 traced_at:z.iso.datetime(),
 promises:z.array(z.strictObject({
  id:z.string(),
  program_sources:z.array(z.strictObject({party:z.string(), ...source.shape})),
  adoption:z.enum(['adopted','weakened','changed','not_in_programs']),
  topic:z.string().min(1),
  competence:z.enum(['state','federal','eu','municipal','mixed']),
  deadline:z.string().nullable(),
  done_when:z.string().min(1).nullable(),
  events:z.array(z.strictObject({date:z.iso.date(), type:z.enum(['announcement','cabinet_decision','bill_introduced','law_passed','regulation_issued','budget_line','government_answer','court_ruling','statistic','report','other']), summary:z.string().min(1), sources:z.array(source).min(1)})),
  status:z.enum(statuses),
  status_reasoning:z.string().min(1),
  open_questions:z.array(z.string()),
 })).length(5),
});

const errors: string[] = [];
const check = (condition: unknown, message: string) => { if (!condition) errors.push(message); };

async function main() {
 const target = state.parse(process.argv[2]);
 const directory = `${root}/data/trial/${target}`;
 const byId = new Map((await readCaptures()).map(capture => [capture.id, capture]));
 const texts = new Map<string, Awaited<ReturnType<typeof captureTexts>>>();
 async function checkQuote(where: string, id: string, quote: string, page: number | null) {
  const capture: Capture | undefined = byId.get(id);
  if (!capture) return check(false, `${where}: unknown capture ${id}`);
  if (capture.error) return check(false, `${where}: source ${id} is a failed capture`);
  if (!texts.has(id)) texts.set(id, await captureTexts(capture));
  check(capture.pdf_info ? page !== null : page === null, `${where}: page must be set for PDFs and null otherwise`);
  check(quoteFound(capture, texts.get(id)!, quote, page), `${where}: quote absent from ${id}: ${quote.slice(0, 60)}`);
 }

 const selection = selectionSchema.parse(await Bun.file(`${directory}/selection.json`).json());
 check(selection.state === target, 'selection.json: wrong state');
 check(byId.has(selection.coalition_agreement_capture), 'selection.json: unknown coalition agreement capture');
 for (const promise of selection.promises) await checkQuote(`selection ${promise.id}`, promise.capture, promise.quote, promise.page);
 check(new Set(selection.promises.map(p => p.kind)).size === 5, 'selection.json: the five promises need five different kinds');

 let traces = 0;
 for await (const name of new Bun.Glob('*.json').scan(directory)) {
  if (name === 'selection.json') continue;
  traces++;
  const trace = traceSchema.parse(await Bun.file(`${directory}/${name}`).json());
  check(trace.state === target, `${name}: wrong state`);
  check(JSON.stringify(trace.promises.map(p => p.id)) === JSON.stringify(selection.promises.map(p => p.id)), `${name}: promise ids differ from selection.json`);
  for (const promise of trace.promises) {
   const where = `${name} ${promise.id}`;
   check(promise.status === 'not_assessable' ? promise.done_when === null : promise.done_when !== null, `${where}: done_when is null exactly when status is not_assessable`);
   for (const program of promise.program_sources) await checkQuote(`${where} program`, program.capture, program.quote, program.page);
   for (const event of promise.events) for (const s of event.sources) await checkQuote(`${where} event ${event.date}`, s.capture, s.quote, s.page);
  }
 }
 check(traces > 0, `no trace files in data/trial/${target}`);
 if (errors.length) {console.error(errors.join('\n')); process.exitCode = 1;}
 else console.log(`Valid: selection and ${traces} trace file(s) for ${target}.`);
}

try {await main();} catch (error) {console.error(error); process.exitCode = 1;}
