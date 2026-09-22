import { pageSchema } from './archive-page';
import { z } from 'zod';
export const state = z.enum(['sachsen-anhalt', 'berlin', 'mecklenburg-vorpommern']);
const url = z.url().refine(v => /^https?:\/\//.test(v));
const timestamp = z.iso.datetime();
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const hash = z.string().regex(/^[a-f0-9]{64}$/);
export const kinds = ['party_website','parliamentary_group_website','program_full','program_short','program_easy_language','program_html','points_list','program_immediate','candidate_list','lead_candidate_page','election_authority_page','election_result','coalition_statement','sondierungspapier','coalition_agreement','position_paper','press_release','drucksache','plenary_protocol','budget','gazette','government_statement','statistic','other'] as const;
export const trackedSchema = z.array(z.strictObject({url,state,party:slug.nullable(),kind:z.enum(kinds),label:z.string().min(1),publisher_type:z.enum(['party','parliamentary_group','election_authority','parliament','government','press']),added_at:timestamp,found_on:url}));
export const captureSchema = z.strictObject({id:z.string(),url,final_url:url.nullable(),retrieved_at:timestamp,http_status:z.number().int().min(100).max(599).nullable(),content_type:z.string().nullable(),bytes:z.number().int().nonnegative().nullable(),sha256:hash.nullable(),text_sha256:hash.nullable(),blob:z.string().nullable(),text:z.string().nullable(),http_last_modified:z.string().nullable(),http_etag:z.string().nullable(),pdf_info:z.strictObject({title:z.string().nullable(),creation_date:z.string().nullable(),mod_date:z.string().nullable(),pages:z.number().int().positive()}).nullable(),wayback_url:url.nullable(),previous_capture:z.string().nullable(),content_changed:z.boolean().nullable(),text_changed:z.boolean().nullable(),error:z.string().nullable(),page:pageSchema.optional(),page_error:z.string().optional()});
export type Capture = z.infer<typeof captureSchema>;
const sources = z.array(z.strictObject({capture:z.string(),quote:z.string().min(1),page:z.number().int().positive().nullable()})).min(1);
const base = {observed_at:timestamp,sources};
const textKeys = ['name_full','name_short','lead_candidate','ballot_scope'] as const;
// Who said what, when. A lead candidate's interview is not automatically the party's position.
const statement = z.strictObject({stated_on:z.iso.date(),speaker:z.string().min(1),speaker_role:z.string().min(1),summary:z.string().min(1)});
const urlKeys = ['website','state_association_website','parliamentary_group_website','program'] as const;
export const factSchema = z.union([
 z.strictObject({...base,key:z.enum(textKeys),value:z.string().min(1)}),
 z.strictObject({...base,key:z.enum(urlKeys),value:url}),
 z.strictObject({...base,key:z.enum(['coalition_position','sondierung_status']),value:statement}),
 z.strictObject({...base,key:z.literal('ballot_admitted'),value:z.boolean()}),
 z.strictObject({...base,key:z.literal('ballot_list_number'),value:z.number().int().positive()}),
 z.strictObject({...base,key:z.literal('in_parliament_before_election'),value:z.boolean()}),
 z.strictObject({...base,key:z.literal('seats_before_election'),value:z.number().int().nonnegative()}),
 z.strictObject({...base,key:z.literal('election_result'),value:z.strictObject({second_vote_pct:z.number().min(0).max(100),seats:z.number().int().nonnegative().nullable(),status:z.enum(['preliminary','final'])})}),
 z.strictObject({...base,key:z.literal('social_account'),value:z.strictObject({platform:z.enum(['x','instagram','facebook','tiktok','bluesky','youtube']),linked_from:z.enum(['state_party','parliamentary_group','lead_candidate']),url})})
]);
export const partySchema = z.strictObject({state,slug,facts:z.array(factSchema),gaps:z.array(z.strictObject({key:z.string().min(1),checked_at:timestamp,note:z.string().min(1),searched:z.array(url)}))});
export type Party = z.infer<typeof partySchema>;
