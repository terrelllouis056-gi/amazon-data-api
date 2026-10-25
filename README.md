# Amazon Data API: client and MCP server

Amazon product data for 23 marketplaces, without the PA-API 5 shutdown and without the Creators API's 10-sales rule: search, product details, ratings and best sellers as JSON.

> Earning Amazon Associates commissions? Check your Associates agreement before using any non-Amazon data source.

**[Try it free on RapidAPI](https://api.yourotherinbox.com/go/github)** (free plan: 500 requests a month)

## Example

`GET /product-details?asin=B088NRLMPV&country=US`

```json
{
  "data": {
    "asin": "B088NRLMPV",
    "title": "Anker USB C to USB C Cable, 60W Fast Charging Cable (2-Pack, 6 ft, Black)",
    "brand": "Anker",
    "url": "https://www.amazon.com/dp/B088NRLMPV",
    "price": 9.99,
    "original_price": null,
    "currency": "USD",
    "images": ["https://m.media-amazon.com/images/I/71IE9dLBduL._AC_SL1500_.jpg"],
    "rating": 4.7,
    "total_ratings": 90221,
    "availability": "In Stock",
    "is_prime": false,
    "is_amazon_choice": true,
    "is_best_seller": false,
    "about": ["Durable Design: Reinforced nylon exterior and a robust core ..."],
    "categories": ["Electronics", "Computers & Accessories", "Computer Accessories & Peripherals", "Cables & Accessories", "Cables & Interconnects", "USB Cables"],
    "best_sellers_rank": [{ "rank": 1, "category": "USB Cables" }],
    "sales_volume": "10K+ bought in past month",
    "has_variations": true
  },
  "meta": { "country": "US", "cached": false, "fetched_at": "2026-10-22T14:05:11.000Z" }
}
```

The full response also has `description` and a `product_details` table. Fields Amazon does not show for a product are `null` (or `[]`).

## Endpoints

| Endpoint | Client method | MCP tool | Returns |
|---|---|---|---|
| `GET /search` | `search` | `search_products` | keyword search with page, sort, price range and category |
| `GET /product-details` | `productDetails` | `get_product` | one product by ASIN: title, price, images, rating, availability, details table, rank |
| `GET /product-reviews` | `productReviews` | `get_reviews` | rating, star breakdown, Amazon's "Customers say" summary, topic tags |
| `GET /best-sellers` | `bestSellers` | `get_best_sellers` | Best Sellers, New Releases, Movers & Shakers, Most Wished For, Gift Ideas; ranks 1 to 100 |

## Marketplaces

Pass `country` as one of these codes (default `US`). Text comes back in the marketplace's language, prices in its currency.

| Code | Marketplace | Code | Marketplace | Code | Marketplace |
|---|---|---|---|---|---|
| US | amazon.com | SE | amazon.se | IN | amazon.in |
| CA | amazon.ca | PL | amazon.pl | JP | amazon.co.jp |
| MX | amazon.com.mx | BE | amazon.com.be | SG | amazon.sg |
| BR | amazon.com.br | TR | amazon.com.tr | AU | amazon.com.au |
| GB | amazon.co.uk | AE | amazon.ae | IE | amazon.ie |
| DE | amazon.de | SA | amazon.sa | ZA | amazon.co.za |
| FR | amazon.fr | EG | amazon.eg | IT | amazon.it |
| ES | amazon.es | NL | amazon.nl | | |

The United Kingdom is `GB`, not `UK`.

## Quickstart: JavaScript / TypeScript

Subscribe on [RapidAPI](https://api.yourotherinbox.com/go/github) and copy your key. Needs Node 18+ (or Deno, Bun, a browser, Workers). No runtime dependencies.

```sh
npm install amazon-data-api
```

```ts
import { AmazonData, AmazonDataError } from 'amazon-data-api';

const amazon = new AmazonData({ apiKey: process.env.RAPIDAPI_KEY! });

try {
  const { data, meta } = await amazon.productDetails({ asin: 'B088NRLMPV', country: 'US' });
  console.log(data.title, data.price, data.currency, meta.fetched_at);
} catch (e) {
  if (e instanceof AmazonDataError) console.error(e.code, e.status, e.message);
  else throw e;
}
```

## Quickstart: MCP server

Gives Claude and other MCP clients four tools: `search_products`, `get_product`, `get_reviews`, `get_best_sellers`.

Claude Desktop (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "amazon-data": {
      "command": "npx",
      "args": ["-y", "amazon-data-api-mcp"],
      "env": { "RAPIDAPI_KEY": "your-rapidapi-key" }
    }
  }
}
```

Claude Code:

```sh
claude mcp add amazon-data -e RAPIDAPI_KEY=your-rapidapi-key -- npx -y amazon-data-api-mcp
```

## Coming from PA-API?

See the [PA-API migration guide](docs/migrate-from-pa-api.md): field mapping, before/after code, and what the Creators API requires.

## FAQ

**Is it free?** The free plan on RapidAPI is 500 requests a month. RapidAPI asks for a card even on free plans. Pro is $15/month for 15,000 requests. Plans are hard limits.

**Why is `top_reviews` empty for US?** Amazon shows no review text to logged-out visitors on amazon.com, so `top_reviews` is always `[]` for `US`. The rating, star breakdown, summary and topic tags are still returned. Other marketplaces usually return 5 to 13 reviews. Full review lists need an Amazon login and are not available.

**Why is a field `null`?** Amazon does not show it for that product or marketplace. For example, `price` is `null` when a product is unavailable.

**Is the data live?** Each call reads Amazon's page at that moment, or returns a copy at most 10 minutes old (1 hour for best sellers). `meta.fetched_at` is when the page was read.

**Earning Amazon Associates commissions? Check your Associates agreement before using any non-Amazon data source.**

## Support

Questions and bug reports: the Discussions tab on the [RapidAPI listing](https://api.yourotherinbox.com/go/github).

## Licence

MIT
