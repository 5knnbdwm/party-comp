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
  for (const name of ['archive-fetch.ts', 'archive-ocr.ts', 'archive-schema.ts', 'archive-validate.ts']) {
    await copyFile(`${root}/scripts/${name}`, `${directory}/scripts/${name}`);
  }
  let version = 1;
  const starts: number[] = [];
  const server = Bun.serve({
    port: 0,
    fetch(request) {
      starts.push(Date.now());
      const path = new URL(request.url).pathname;
      if (path === '/missing') return new Response('Gone', { status: 404 });
      if (path === '/redirect') return Response.redirect(new URL('/document', request.url));
      return new Response(`<html><body><nav>Chrome</nav><main><h1>Programm</h1><p>Version ${version}</p></main></body></html>`, {
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
    expect(first[2].http_status).toBe(404);
    expect(first[2].sha256).toBeNull();
    expect(first[0].sha256).toBe(first[1].sha256);
    for (let i = 1; i < starts.length; i++) expect(starts[i]! - starts[i - 1]!).toBeGreaterThanOrEqual(995);
    expect((await run('archive-fetch.ts', ['--url', document])).code).toBe(0);
    const second = await read();
    expect(second.slice(0, 3)).toEqual(first);
    expect(second[3].content_changed).toBe(false);
    expect(second[3].text_changed).toBe(false);
    expect(second[3].blob).toBe(first[0].blob);
    version++;
    expect((await run('archive-fetch.ts', ['--url', document])).code).toBe(0);
    const third = await read();
    expect(third[4].content_changed).toBe(true);
    expect(third[4].text_changed).toBe(true);
    expect((await run('archive-validate.ts')).code).toBe(0);

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

    await Bun.write(`${directory}/${third[4].blob}`, 'corrupted');
    expect((await run('archive-validate.ts')).code).toBe(1);
  } finally {
    server.stop(true);
  }
}, 20000);
