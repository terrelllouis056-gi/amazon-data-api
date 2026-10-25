# Migrating from PA-API 5

> Earning Amazon Associates commissions? Check your Associates agreement before using any non-Amazon data source.

This guide is for sites and tools that used PA-API 5 for catalog data (title, price, image, rating, availability) and do not earn Associates commissions.

## What happened to PA-API 5

Amazon's [PA-API 5 deprecation notice](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/paapiv5-deprecation) says PA-API 5 "has been deprecated and is being replaced by the Creators API", and that applications still calling it "receive an HTTP 403 Forbidden response with an AccessDeniedException".

## The Creators API's 10-sales rule

Amazon's [Creators API introduction](https://affiliate-program.amazon.com/creatorsapi/docs/en-us/introduction) lists, as a prerequisite for accessing the PA API through the Creators API: "Have at least 10 qualifying sales within the past 30 days". Sites that do not drive Associates sales cannot meet this. The Amazon page we read does not say what response an account below the threshold gets; third-party reports describe a 403, and we have not confirmed that on an Amazon page.

## Associates agreement

The Associates Program policies currently say Product Advertising Content may be obtained by calling the Creators API or PA-API, and prohibit data mining, robots and similar extraction tools (see the [Associates Program Policies](https://affiliate-program.amazon.com/help/operating/policies)). If you earn commissions, read them before changing your data source. This API is not an Amazon service.

## Field mapping

| PA-API 5 resource | This API | Notes |
|---|---|---|
| `ASIN` | `asin` | |
| `DetailPageURL` | `url` | plain product URL |
| `ItemInfo.Title` | `title` | |
| `ItemInfo.ByLineInfo.Brand` | `brand` | |
| `ItemInfo.Features` | `about` | bullet points |
| `ItemInfo.ProductInfo`, `ItemInfo.TechnicalInfo`, `ItemInfo.ManufactureInfo` | `product_details` | one label to value table; labels are in the marketplace's language |
| `Offers.Listings.Price` | `price`, `currency` | numbers, not formatted strings |
| `Offers.Listings.SavingBasis` | `original_price` | the struck-through list price |
| `Offers.Listings.Availability` | `availability` | Amazon's text, e.g. "In Stock" |
| `Offers.Listings.DeliveryInfo.IsPrimeEligible` | `is_prime` | |
| `Images.Primary`, `Images.Variants` | `images` | full-size URLs, one list |
| `CustomerReviews.StarRating` | `rating` | |
| `CustomerReviews.Count` | `total_ratings` | |
| `BrowseNodeInfo.BrowseNodes` | `categories` | names only, no node IDs |
| `BrowseNodeInfo.WebsiteSalesRank` | `best_sellers_rank` | `{ rank, category }[]` |
| `ParentASIN`, `VariationSummary` | `has_variations` | a flag only; no variation list |
| `SearchItems` (`Keywords`, `SearchIndex`, `ItemPage`, `SortBy`, `MinPrice`, `MaxPrice`) | `/search` (`query`, `category`, `page`, `sort`, `min_price`, `max_price`) | `MinPrice`/`MaxPrice` are in the lowest currency unit (cents); ours are plain numbers in the marketplace's currency. Results carry `asin`, `title`, `price`, `rating`, `image` and flags; `has_next_page` replaces `SearchResult.TotalResultCount` |
| `GetBrowseNodes` | `/best-sellers` (by category slug) | ranked lists, not the browse-node tree |

Fields this API returns that PA-API did not: `is_amazon_choice`, `is_best_seller`, `sales_volume`, `rating_distribution`, `customers_say`, `aspects`.

No equivalent in this API: `GetVariations` (full variation list), `Offers.Listings.MerchantInfo`, `Offers.Summaries` (lowest/highest price across sellers), `Offers.Listings.Condition`, `RentalOffers`, `ItemInfo.ExternalIds` (UPC/EAN/ISBN, except where they appear in `product_details`), `ItemInfo.Classifications` (Binding, ProductGroup), `ItemInfo.ContentRating`, and the `Resources` parameter (every response returns all fields). Multi-ASIN batching (up to 10 ASINs per `GetItems` call) has no equivalent: one request returns one product.

## Before and after

Before (PA-API 5, signed request):

```js
// GetItems with ItemInfo.Title, Offers.Listings.Price, Images.Primary, CustomerReviews
const res = await paapi.getItems({
  ItemIds: ['B088NRLMPV'],
  Resources: ['ItemInfo.Title', 'Offers.Listings.Price', 'Images.Primary.Large', 'CustomerReviews.StarRating'],
});
const item = res.ItemsResult.Items[0];
console.log(item.ItemInfo.Title.DisplayValue, item.Offers.Listings[0].Price.Amount);
```

After:

```ts
import { AmazonData } from 'amazon-data-api';

const amazon = new AmazonData({ apiKey: process.env.RAPIDAPI_KEY! });
const { data } = await amazon.productDetails({ asin: 'B088NRLMPV', country: 'US' });
console.log(data.title, data.price, data.images[0], data.rating);
```

Search:

```ts
const { data } = await amazon.search({ query: 'usb c cable', country: 'US', max_price: 20 });
for (const r of data.results) console.log(r.asin, r.title, r.price);
```

## Differences to plan for

- Data is read from Amazon pages at request time, so a fresh call takes 3 to 6 seconds. The client has no timeout option; to wait at least 60 seconds, pass a custom `fetch`: `new AmazonData({ apiKey, fetch: (u, i) => fetch(u, { ...i, signal: AbortSignal.timeout(60_000) }) })`. Results are cached for 10 minutes (1 hour for best sellers).
- Authentication is one RapidAPI key, not signed requests or Associates credentials.
- Plans are hard limits: free 500 requests a month, Pro $15/month for 15,000. [Try it free](https://api.yourotherinbox.com/go/github).
