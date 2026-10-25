# amazon-data-api

Typed client for the [Amazon Data API](https://rapidapi.com/terrelllouis056/api/amazon-data-api-search-product-reviews-best-sellers) on RapidAPI: search, product details, ratings and best sellers for 23 Amazon marketplaces. No runtime dependencies; uses global `fetch` (Node 18+, Deno, Bun, browsers, Workers).

> Earning Amazon Associates commissions? Check your Associates agreement before using any non-Amazon data source.

```sh
npm install amazon-data-api
```

```ts
import { AmazonData, AmazonDataError } from 'amazon-data-api';

const amazon = new AmazonData({ apiKey: process.env.RAPIDAPI_KEY! });

const { data } = await amazon.search({ query: 'usb c cable', country: 'US', sort: 'price_asc' });
const product = await amazon.productDetails({ asin: data.results[0].asin });
const reviews = await amazon.productReviews({ asin: 'B088NRLMPV', country: 'DE' });
const top = await amazon.bestSellers({ category: 'electronics', type: 'new-releases' });
```

Every method returns `{ data, meta }`. Errors throw `AmazonDataError` with `code` (the API's `error.code`, e.g. `invalid_input`, `not_found`, `busy`) and `status` (HTTP status).

Get a key and a free plan (500 requests a month) on [RapidAPI](https://rapidapi.com/terrelllouis056/api/amazon-data-api-search-product-reviews-best-sellers). Full docs: https://github.com/terrelllouis056-gi/amazon-data-api

MIT
