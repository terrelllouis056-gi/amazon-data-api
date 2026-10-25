import { describe, it, expect, vi } from 'vitest';
import { spawnSync } from 'node:child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { InMemoryTransport } from '@modelcontextprotocol/sdk/inMemory.js';
import { AmazonDataError } from 'amazon-data-api';
import { createServer } from '../src/server.js';

async function connect(fake: any) {
  const [a, b] = InMemoryTransport.createLinkedPair();
  await createServer(fake).connect(a);
  const client = new Client({ name: 't', version: '0' });
  await client.connect(b);
  return client;
}
const fake = () => ({ search: vi.fn(), productDetails: vi.fn(), productReviews: vi.fn(), bestSellers: vi.fn() });

describe('mcp server', () => {
  it('lists the 4 tools', async () => {
    const c = await connect(fake());
    expect((await c.listTools()).tools.map(t => t.name).sort()).toEqual(['get_best_sellers', 'get_product', 'get_reviews', 'search_products']);
  });
  it('get_product calls the client and returns data', async () => {
    const f = fake(); f.productDetails.mockResolvedValue({ data: { asin: 'B088NRLMPV' }, meta: {} });
    const r: any = await (await connect(f)).callTool({ name: 'get_product', arguments: { asin: 'B088NRLMPV' } });
    expect(f.productDetails).toHaveBeenCalledWith({ asin: 'B088NRLMPV' });
    expect(JSON.parse(r.content[0].text)).toEqual({ asin: 'B088NRLMPV' });
  });
  it('maps AmazonDataError to isError', async () => {
    const f = fake(); f.productDetails.mockRejectedValue(new AmazonDataError('not_found', 404, 'gone'));
    const r: any = await (await connect(f)).callTool({ name: 'get_product', arguments: { asin: 'B088NRLMPV' } });
    expect(r.isError).toBe(true);
    expect(r.content[0].text).toContain('not_found');
  });
  it('rejects invalid input', async () => {
    const f = fake();
    const r: any = await (await connect(f)).callTool({ name: 'get_best_sellers', arguments: { category: 'electronics', page: 3 } }).catch(e => ({ isError: true, e }));
    expect(r.isError).toBe(true);
    expect(f.bestSellers).not.toHaveBeenCalled();
  });
  it('exits 1 with a one-line message without RAPIDAPI_KEY', () => {
    const { RAPIDAPI_KEY, ...env } = process.env;
    const r = spawnSync('node', ['dist/index.js'], { env, encoding: 'utf8' });
    expect(r.status).toBe(1);
    expect(r.stderr).toContain('RAPIDAPI_KEY');
    expect(r.stderr).not.toContain('    at ');
  });
});
