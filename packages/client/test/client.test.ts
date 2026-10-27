import { describe, expect, it, test, vi } from 'vitest';
import { AmazonData, AmazonDataError } from '../src/index.js';

const HOST = 'amazon-data-api-search-product-reviews-best-sellers.p.rapidapi.com';
const reply = (status: number, body: string) =>
  vi.fn(async () => new Response(body, { status }));

describe('AmazonData', () => {
  it('productDetails sends url and headers, returns parsed body', async () => {
    const body = { data: { asin: 'B088NRLMPV' }, meta: { country: 'US', cached: false, fetched_at: 'x' } };
    const f = reply(200, JSON.stringify(body));
    const c = new AmazonData({ apiKey: 'k', fetch: f as any });
    expect(await c.productDetails({ asin: 'B088NRLMPV' })).toEqual(body);
    const [url, init] = f.mock.calls[0] as any;
    expect(url).toBe(`https://${HOST}/product-details?asin=B088NRLMPV`);
    expect(init.headers).toEqual({ 'X-RapidAPI-Key': 'k', 'X-RapidAPI-Host': HOST });
  });

  it('search omits undefined params', async () => {
    const f = reply(200, '{}');
    await new AmazonData({ apiKey: 'k', fetch: f as any }).search({ query: 'usb c', sort: 'price_asc', country: undefined });
    expect((f.mock.calls[0] as any)[0]).toBe(`https://${HOST}/search?query=usb+c&sort=price_asc`);
  });

  it('maps API errors', async () => {
    const c = new AmazonData({ apiKey: 'k', fetch: reply(400, '{"error":{"code":"invalid_input","message":"bad asin"}}') as any });
    const e = await c.productDetails({ asin: 'x' }).catch((e) => e);
    expect(e).toBeInstanceOf(AmazonDataError);
    expect([e.code, e.status, e.message]).toEqual(['invalid_input', 400, 'bad asin']);
  });

  it('maps RapidAPI gateway errors', async () => {
    const c = new AmazonData({ apiKey: 'k', fetch: reply(403, '{"message":"You are not subscribed to this API."}') as any });
    const e = await c.productDetails({ asin: 'x' }).catch((e) => e);
    expect(e).toBeInstanceOf(AmazonDataError);
    expect([e.code, e.status, e.message]).toEqual(['rapidapi_error', 403, 'You are not subscribed to this API.']);
  });

  it('maps non-JSON errors', async () => {
    const c = new AmazonData({ apiKey: 'k', fetch: reply(502, '<html>bad gateway</html>') as any });
    const e = await c.bestSellers({ category: 'electronics' }).catch((e) => e);
    expect([e.code, e.status]).toEqual(['http_error', 502]);
  });

  it.each([
    ['sellerProducts', { seller_id: 'A2L77EE7U53NWQ', page: 2 }, 'seller-products?seller_id=A2L77EE7U53NWQ&page=2'],
    ['productLookup', { identifier: '0885909950805' }, 'product-lookup?identifier=0885909950805'],
    ['productOffers', { asin: 'B088NRLMPV', country: 'DE' }, 'product-offers?asin=B088NRLMPV&country=DE'],
    ['deals', undefined, 'deals?'],
    ['sellerProfile', { seller_id: 'A2L77EE7U53NWQ' }, 'seller-profile?seller_id=A2L77EE7U53NWQ'],
    ['categories', { category: 'electronics' }, 'categories?category=electronics'],
    ['searchAutocomplete', { query: 'usb c' }, 'search-autocomplete?query=usb+c'],
    ['productsByCategory', { category: 'toys', sort: 'reviews' }, 'products-by-category?category=toys&sort=reviews'],
  ])('%s hits the right path', async (method, params, path) => {
    const f = reply(200, '{}');
    await (new AmazonData({ apiKey: 'k', fetch: f as any }) as any)[method](params);
    expect((f.mock.calls[0] as any)[0]).toBe(`https://${HOST}/${path}`);
  });

  it('requires apiKey', () => {
    expect(() => new AmazonData({ apiKey: '' })).toThrow(TypeError);
  });

  test.skipIf(!process.env.RAPIDAPI_KEY)('live: productDetails US', async () => {
    const r = await new AmazonData({ apiKey: process.env.RAPIDAPI_KEY! }).productDetails({ asin: 'B088NRLMPV' });
    expect(r.data.asin).toBe('B088NRLMPV');
  }, 60000);
});

it('calls fetch unbound (no Illegal invocation with globalThis.fetch)', async () => {
  const f = function (this: unknown) {
    if (this !== undefined && this !== globalThis) throw new TypeError('Illegal invocation');
    return Promise.resolve(new Response('{}', { status: 200 }));
  };
  await expect(new AmazonData({ apiKey: 'k', fetch: f as any }).search({ query: 'x' })).resolves.toEqual({});
});
