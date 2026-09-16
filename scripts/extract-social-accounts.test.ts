import { test, expect } from 'bun:test';
import { profileLink } from './extract-social-accounts';

test('profileLink keeps profiles and drops posts and share links', () => {
  expect(profileLink('http://instagram.com/cdu_lsa')).toEqual({ platform: 'instagram', url: 'https://instagram.com/cdu_lsa', handle: 'cdu_lsa' });
  expect(profileLink('https://www.tiktok.com/@diegruenen?lang=de-DE')?.url).toBe('https://tiktok.com/@diegruenen');
  expect(profileLink('https://www.youtube.com/user/DJFeuerstuhl/videos')?.url).toBe('https://youtube.com/user/DJFeuerstuhl');
  expect(profileLink('https://www.facebook.com/pg/Tierschutzpartei/posts/')?.handle).toBe('tierschutzpartei');
  expect(profileLink('https://bsky.app/profile/gruene.de')?.platform).toBe('bluesky');
  for (const href of [
    'https://www.instagram.com/p/Dc8hSl1iEnx/', 'https://www.instagram.com/explore/tagscdulsa',
    'https://www.facebook.com/sharer/sharer.php?u=x', 'https://bsky.app/intent/compose?text=x',
    'https://www.youtube.com/watch?v=bv6F_xQazoY', 'https://example.org/instagram.com/x',
    'https://www.facebook.com/1543412951160409', 'https://www.facebook.com/pages/Name/123',
  ]) expect(profileLink(href)).toBeNull();
});
