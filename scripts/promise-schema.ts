import { z } from 'zod';
import { state } from './archive-schema';

// Promise records extracted from party programs. See docs/promise-format.md.

export const topics = ['arbeit','bildung','demokratie','digitales','energie','familie','finanzen','gesundheit','innere_sicherheit','justiz','kultur','landwirtschaft','medien','migration','soziales','umwelt','verkehr','verwaltung','wirtschaft','wohnen'] as const;

const deadline = z.discriminatedUnion('type', [
 z.strictObject({type:z.literal('none')}),
 z.strictObject({type:z.literal('date'), date:z.iso.date()}),
 z.strictObject({type:z.literal('recurring'), every:z.enum(['year','month','school_year','term']), from:z.string().min(1)}),
 z.strictObject({type:z.literal('relative'), text:z.string().min(1), anchor:z.enum(['government_start','election','term_end','other'])}),
]);

export const promiseSchema = z.strictObject({
 id:z.string().regex(/^[a-z-]+-\d{3}$/),
 text:z.string().min(1),
 sources:z.array(z.strictObject({capture:z.string(), quote:z.string().min(1), page:z.number().int().positive().nullable()})).min(1),
 topic:z.enum(topics),
 competence:z.enum(['state','federal','eu','municipal','mixed']),
 commitment_type:z.enum(['own_action','support_external']),
 done_when:z.string().min(1).nullable(),
 measure:z.strictObject({unit:z.string().min(1), target:z.number().nullable(), baseline:z.string().min(1).nullable()}).nullable(),
 deadline,
 parent:z.string().nullable(),
 notes:z.string().min(1).nullable(),
 extracted_by:z.string().min(1),
 extracted_at:z.iso.datetime(),
 reviewed_at:z.iso.datetime().nullable(),
});

export const promiseFileSchema = z.strictObject({
 state,
 party:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
 election:z.iso.date(),
 promises:z.array(promiseSchema),
});

export type PromiseFile = z.infer<typeof promiseFileSchema>;
