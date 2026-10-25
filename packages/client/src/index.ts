import type { BestSellersData, Country, Envelope, ListType, Product, Reviews, SearchData, Sort } from './types.js';
export * from './types.js';

const HOST = 'amazon-data-api-search-product-reviews-best-sellers.p.rapidapi.com';

export class AmazonDataError extends Error {
  constructor(public code: string, public status: number, message: string) {
    super(message);
    this.name = 'AmazonDataError';
  }
}

export class AmazonData {
  private apiKey: string;
  private fetchFn: typeof fetch;

  constructor(opts: { apiKey: string; fetch?: typeof fetch }) {
    if (!opts?.apiKey) throw new TypeError('apiKey is required');
    this.apiKey = opts.apiKey;
    this.fetchFn = opts.fetch ?? globalThis.fetch;
  }

  search(p: { query: string; country?: Country; page?: number; sort?: Sort; min_price?: number; max_price?: number; category?: string }) {
    return this.get<SearchData>('search', p);
  }
  productDetails(p: { asin: string; country?: Country }) {
    return this.get<Product>('product-details', p);
  }
  productReviews(p: { asin: string; country?: Country }) {
    return this.get<Reviews>('product-reviews', p);
  }
  bestSellers(p: { category: string; type?: ListType; country?: Country; page?: 1 | 2 }) {
    return this.get<BestSellersData>('best-sellers', p);
  }

  private async get<T>(path: string, params: object): Promise<Envelope<T>> {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) if (v !== undefined) qs.set(k, String(v));
    // Unbound call: a stored globalThis.fetch throws 'Illegal invocation' when called as a method.
    const f = this.fetchFn;
    const res = await f(`https://${HOST}/${path}?${qs}`, {
      headers: { 'X-RapidAPI-Key': this.apiKey, 'X-RapidAPI-Host': HOST },
    });
    const text = await res.text();
    let body: any;
    try { body = JSON.parse(text); } catch { body = undefined; }
    if (res.ok) {
      if (body === undefined) throw new AmazonDataError('http_error', res.status, 'Invalid JSON in response');
      return body;
    }
    if (body?.error?.code) throw new AmazonDataError(body.error.code, res.status, body.error.message);
    if (typeof body?.message === 'string') throw new AmazonDataError('rapidapi_error', res.status, body.message);
    throw new AmazonDataError('http_error', res.status, `HTTP ${res.status}`);
  }
}
