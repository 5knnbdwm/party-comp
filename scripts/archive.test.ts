import { test, expect } from 'bun:test';
import { copyFile, mkdir, mkdtemp, symlink } from 'node:fs/promises';
import { root } from './archive-fetch';
import { captureSchema } from './archive-schema';

test('captures are append-only, deduplicated, rate-limited, and checked for corruption', async () => {
  await mkdir(`${root}/tmp`, { recursive: true });
  const directory = await mkdtemp(`${root}/tmp/archive-test-`);
  await mkdir(`${directory}/scripts`);
  await mkdir(`${directory}/archive`);
  await symlink(`${root}/node_modules`, `${directory}/node_modules`, 'dir');
  for (const name of ['archive-page.ts', 'archive-fetch.ts', 'archive-ocr.ts', 'archive-quotes.ts', 'archive-schema.ts', 'archive-validate.ts']) {
    await copyFile(`${root}/scripts/${name}`, `${directory}/scripts/${name}`);
  }
  let version = 1;
  const starts: number[] = [];
  const server = Bun.serve({
    port: 0,
    fetch(request) {
      starts.push(Date.now());
      const path = new URL(request.url).pathname;
      if (path === '/style.css') return new Response('main {color: rgb(10, 20, 30)}', { headers: { 'Content-Type': 'text/css' } });
      if (path === '/missing') return new Response('Gone', { status: 404 });
      if (path === '/redirect') return Response.redirect(new URL('/document', request.url));
      return new Response(`<html><head><link rel="stylesheet" href="/style.css"></head><body><nav>Chrome</nav><main><h1>Programm</h1><p>Version ${version}</p></main></body></html>`, {
        headers: { 'Content-Type': 'text/html' },
      });
    },
  });
  const document = new URL('/document', server.url).href;
  const urls = ['/document', '/redirect', '/missing'].map(path => ({
    url: new URL(path, server.url).href,
    state: 'berlin', party: null, kind: 'other', label: 'Test fixture',
    publisher_type: 'election_authority', added_at: new Date().toISOString(), found_on: document,
  }));
  await Bun.write(`${directory}/archive/tracked-urls.json`, JSON.stringify(urls));
  async function run(script: string, args: string[] = []) {
    const subprocess = Bun.spawn(['bun', `${directory}/scripts/${script}`, ...args], { stdout: 'pipe', stderr: 'pipe' });
    const [code, stdout, stderr] = await Promise.all([
      subprocess.exited, new Response(subprocess.stdout).text(), new Response(subprocess.stderr).text(),
    ]);
    return { code, stdout, stderr };
  }
  const read = async () => (await Bun.file(`${directory}/archive/captures.jsonl`).text()).trim().split('\n').map(line => captureSchema.parse(JSON.parse(line)));
  try {
    expect((await run('archive-fetch.ts')).code).toBe(1);
    const first = await read();
    expect(first).toHaveLength(3);
    // Workers append as each fetch finishes, so look the fixtures up by URL rather than by position.
    const captureOf = (path: string) => first.find(item => item.url === new URL(path, server.url).href)!;
    const [documentCapture, redirectCapture, missingCapture] = ['/document', '/redirect', '/missing'].map(captureOf);
    expect(documentCapture.page?.resources[0]?.action).toBe('preserved');
    expect(missingCapture.http_status).toBe(404);
    expect(missingCapture.sha256).toBeNull();
    expect(documentCapture.sha256).toBe(redirectCapture.sha256);
    for (let i = 1; i < starts.length; i++) expect(starts[i]! - starts[i - 1]!).toBeGreaterThanOrEqual(995);
    expect((await run('archive-fetch.ts', ['--url', document])).code).toBe(0);
    const second = await read();
    expect(second.slice(0, 3)).toEqual(first);
    expect(second[3].content_changed).toBe(false);
    expect(second[3].text_changed).toBe(false);
    expect(second[3].blob).toBe(documentCapture.blob);
    version++;
    expect((await run('archive-fetch.ts', ['--url', document])).code).toBe(0);
    const third = await read();
    expect(third[4].content_changed).toBe(true);
    expect(third[4].text_changed).toBe(true);
    const validated = await run('archive-validate.ts');
    expect(validated.stderr).toBe('');
    expect(validated.code).toBe(0);

    // Facts must show their value in a quote, and gaps must name captured pages.
    const partyPath = `${directory}/data/parties/berlin/test.json`;
    const fact = (value: string) => ({ key: 'name_full', value, observed_at: new Date().toISOString(), sources: [{ capture: third[4].id, quote: 'Programm', page: null }] });
    const gap = (searched: string[]) => ({ key: 'lead_candidate', checked_at: new Date().toISOString(), note: 'Not on the page.', searched });
    const writeParty = (facts: unknown[], gaps: unknown[]) => Bun.write(partyPath, JSON.stringify({ state: 'berlin', slug: 'test', facts, gaps }));
    await writeParty([fact('Programm')], [gap([document])]);
    expect((await run('archive-validate.ts')).code).toBe(0);
    await writeParty([fact('Andere Partei')], []);
    expect((await run('archive-validate.ts')).stderr).toContain('name_full not supported by its sources');
    await writeParty([], [gap([])]);
    expect((await run('archive-validate.ts')).stderr).toContain('lists no searched pages');
    await writeParty([], []);

    const asset = third[4].page!.files.find(file => file.blob.endsWith('.css'))!;
    const saved = await Bun.file(`${directory}/${asset.blob}`).text();
    await Bun.write(`${directory}/${asset.blob}`, 'corrupted');
    expect((await run('archive-validate.ts')).stderr).toContain('snapshot asset hash mismatch');
    await Bun.write(`${directory}/${asset.blob}`, saved);
    await Bun.write(`${directory}/${third[4].blob}`, 'corrupted');
    expect((await run('archive-validate.ts')).code).toBe(1);
  } finally {
    server.stop(true);
  }
}, 30000);
