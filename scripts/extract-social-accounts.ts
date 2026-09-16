import { parseHTML } from 'linkedom';
import { readCaptures, root } from './archive-fetch';
import { partySchema, trackedSchema, type Party } from './archive-schema';

type Platform = Extract<Party['facts'][number], {key:'social_account'}>['value']['platform'];
type LinkedFrom = Extract<Party['facts'][number], {key:'social_account'}>['value']['linked_from'];

const platforms: Record<string, Platform> = {'instagram.com':'instagram','facebook.com':'facebook','x.com':'x','twitter.com':'x','tiktok.com':'tiktok','youtube.com':'youtube','bsky.app':'bluesky'};
// First path segments that are posts, share buttons or site pages, never profiles.
const notProfiles: Record<Platform, string[]> = {
 instagram:['p','reel','reels','explore','stories','tv','accounts','share'],
 facebook:['sharer','sharer.php','share','share.php','dialog','plugins','privacy','policies','help','tr','events','watch','photo','photo.php','story.php','hashtag','login','profile.php','groups'],
 x:['intent','share','home','hashtag','search','i','explore','settings','login'],
 tiktok:[],
 youtube:['watch','embed','playlist','shorts','results','feed','redirect','live','t','about','hashtag'],
 bluesky:[],
};

/**
 * Returns the profile a social link points to, or null for posts, shares and other non-profile links.
 * `url` keeps the host and path exactly as linked, so it stays a substring of the quoted href.
 */
export function profileLink(href: string): {platform:Platform; url:string; handle:string} | null {
 let link: URL;
 try {link = new URL(href);} catch {return null;}
 const host = link.hostname.toLowerCase().replace(/^(www|m)\./,'');
 const platform = platforms[host];
 if (!platform) return null;
 const segments = link.pathname.split('/').filter(Boolean);
 const first = segments[0];
 if (!first || notProfiles[platform].includes(first.toLowerCase())) return null;
 // Numeric Facebook paths are posts or feed items, and facebook.com/pages/… has no stable handle.
 if (platform === 'facebook' && (first === 'pages' || /^\d+$/.test(first))) return null;
 let path: string[];
 if (platform === 'tiktok') path = first.startsWith('@') ? [first] : [];
 else if (platform === 'bluesky') path = first === 'profile' && segments[1] ? segments.slice(0,2) : [];
 else if (platform === 'facebook' && first === 'pg') path = segments[1] ? segments.slice(0,2) : [];
 else if (platform === 'youtube' && ['channel','user','c'].includes(first)) path = segments[1] ? segments.slice(0,2) : [];
 else path = [first];
 if (!path.length) return null;
 return {platform, url:`https://${host}/${path.join('/')}`, handle:path.at(-1)!.replace(/^@/,'').toLowerCase()};
}

const chrome = 'header,footer,nav,[class*="footer"],[class*="header"],[id*="footer"],[id*="header"]';

async function main() {
 const tracked = trackedSchema.parse(await Bun.file(`${root}/archive/tracked-urls.json`).json());
 const latest = new Map<string, Awaited<ReturnType<typeof readCaptures>>[number]>();
 for (const capture of await readCaptures()) if (!capture.error) latest.set(capture.url, capture);
 let added = 0;
 for await (const path of new Bun.Glob('data/parties/**/*.json').scan(root)) {
  const party = partySchema.parse(await Bun.file(`${root}/${path}`).json());
  const stateSite = party.facts.findLast(fact => fact.key === 'state_association_website')?.value;
  // Pages whose links count as official: the state association site, the parliamentary group site, lead candidate pages.
  const pages = tracked.flatMap(item => {
   if (item.state !== party.state || item.party !== party.slug) return [];
   const linkedFrom: LinkedFrom | null = item.kind === 'parliamentary_group_website' ? 'parliamentary_group'
    : item.kind === 'lead_candidate_page' ? 'lead_candidate'
    : item.kind === 'party_website' && item.url === stateSite ? 'state_party' : null;
   return linkedFrom ? [{url:item.url, linkedFrom}] : [];
  });
  // Site-wide links in header, footer and navigation belong to the site owner. Links in the page body
  // are content: embedded posts, news outlets, individual MPs. Lead candidate pages are the exception:
  // their body links are the candidate's, minus accounts the party's own sites already link.
  const partyHandles = new Set<string>();
  const seen = new Set(party.facts.flatMap(fact => fact.key === 'social_account' ? [`${fact.value.linked_from} ${fact.value.platform} ${profileLink(fact.value.url)?.handle}`] : []));
  pages.sort((a, b) => Number(a.linkedFrom === 'lead_candidate') - Number(b.linkedFrom === 'lead_candidate'));
  for (const page of pages) {
   const capture = latest.get(page.url);
   if (!capture?.blob?.endsWith('.html')) continue;
   const raw = await Bun.file(`${root}/${capture.blob}`).text();
   const {document} = parseHTML(raw);
   for (const anchor of document.querySelectorAll('a[href]')) {
    const href = anchor.getAttribute('href')!;
    const profile = profileLink(href);
    // The quote must appear verbatim in the raw HTML; skip hrefs that the parser re-encoded.
    if (!profile || !raw.includes(href)) continue;
    const inChrome = Boolean(anchor.closest(chrome));
    const handle = `${profile.platform} ${profile.handle}`;
    if (page.linkedFrom === 'lead_candidate' ? inChrome || partyHandles.has(handle) : !inChrome) continue;
    if (page.linkedFrom !== 'lead_candidate') partyHandles.add(handle);
    const key = `${page.linkedFrom} ${profile.platform} ${profile.handle}`;
    if (seen.has(key)) continue;
    seen.add(key);
    party.facts.push({key:'social_account', value:{platform:profile.platform, linked_from:page.linkedFrom, url:profile.url}, observed_at:new Date().toISOString(), sources:[{capture:capture.id, quote:href, page:null}]});
    added++;
    console.log(`${party.state}/${party.slug} ${page.linkedFrom} ${profile.platform} ${profile.url}`);
   }
  }
  await Bun.write(`${root}/${path}`, JSON.stringify(party, null, 2) + '\n');
 }
 console.log(`Added ${added} social_account facts.`);
}

if (import.meta.main) await main();
