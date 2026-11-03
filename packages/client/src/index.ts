import type {
  AutocompleteData, BestSellersData, CategoriesData, CategoryProductsData, Country, DealsData, Envelope, ListType,
  InfluencerPostsData, InfluencerProfile, LookupData, OffersData, Product, PromoDetails, RawPage, Reviews, SearchData,
  SellerProductsData, SellerProfile, SellerReviewsData, Sort,
} from './types.js';
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
  sellerProducts(p: { seller_id: string; country?: Country; page?: number; sort?: Sort }) {
    return this.get<SellerProductsData>('seller-products', p);
  }
  /** UPC, EAN, ISBN-10/13 or GTIN; hyphens and spaces are ignored. */
  productLookup(p: { identifier: string; country?: Country }) {
    return this.get<LookupData>('product-lookup', p);
  }
  productOffers(p: { asin: string; country?: Country; page?: number }) {
    return this.get<OffersData>('product-offers', p);
  }
  deals(p: { country?: Country; page?: 1 } = {}) {
    return this.get<DealsData>('deals', p);
  }
  sellerProfile(p: { seller_id: string; country?: Country }) {
    return this.get<SellerProfile>('seller-profile', p);
  }
  /** Newest feedback first; pass the previous response's next_cursor as `cursor` for older pages. */
  sellerReviews(p: { seller_id: string; cursor?: string; country?: Country }) {
    return this.get<SellerReviewsData>('seller-reviews', p);
  }
  /** `handle` is the name in amazon.com/shop/<handle>. */
  influencerProfile(p: { handle: string; country?: Country }) {
    return this.get<InfluencerProfile>('influencer-profile', p);
  }
  /** The newest video posts (up to 10), each with the ASINs it features. */
  influencerPosts(p: { handle: string; country?: Country }) {
    return this.get<InfluencerPostsData>('influencer-posts', p);
  }
  /** `promo_id` is the ID in an amazon.com/promotion/psp/<promo_id> link. */
  promoCodeDetails(p: { promo_id: string; country?: Country }) {
    return this.get<PromoDetails>('promo-code-details', p);
  }
  /** Raw HTML of any page on the 23 Amazon marketplaces; the marketplace comes from the URL. */
  scrapeUrl(p: { url: string; country?: Country }) {
    return this.get<RawPage>('scrape-url', p);
  }
  /** Omit `category` for the top-level tree; pass a returned `path` to go one level down. */
  categories(p: { category?: string; country?: Country } = {}) {
    return this.get<CategoriesData>('categories', p);
  }
  searchAutocomplete(p: { query: string; country?: Country }) {
    return this.get<AutocompleteData>('search-autocomplete', p);
  }
  productsByCategory(p: { category: string; country?: Country; page?: number; sort?: Sort }) {
    return this.get<CategoryProductsData>('products-by-category', p);
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
