export type Country = 'US'|'CA'|'MX'|'BR'|'GB'|'DE'|'FR'|'IT'|'ES'|'NL'|'SE'|'PL'|'BE'|'TR'|'AE'|'SA'|'EG'|'IN'|'JP'|'SG'|'AU'|'IE'|'ZA';
export type ListType = 'bestsellers'|'new-releases'|'movers-and-shakers'|'most-wished-for'|'gift-ideas';
export type Sort = 'relevance'|'price_asc'|'price_desc'|'reviews'|'newest'|'bestsellers';

export interface Envelope<T> {
  data: T;
  meta: { country: Country; cached: boolean; fetched_at: string };
}

export interface SearchResult {
  position: number;
  asin: string;
  title: string;
  url: string;
  image: string | null;
  price: number | null;
  original_price: number | null;
  currency: string;
  rating: number | null;
  total_ratings: number | null;
  is_prime: boolean;
  is_sponsored: boolean;
  is_amazon_choice: boolean;
  is_best_seller: boolean;
  sales_volume: string | null;
}
export interface SearchData { query: string; page: number; has_next_page: boolean; results: SearchResult[] }

export interface Product {
  asin: string;
  title: string;
  url: string;
  brand: string | null;
  price: number | null;
  original_price: number | null;
  currency: string;
  images: string[];
  rating: number | null;
  total_ratings: number | null;
  availability: string | null;
  is_prime: boolean;
  is_amazon_choice: boolean;
  is_best_seller: boolean;
  about: string[];
  description: string | null;
  product_details: Record<string, string>;
  categories: string[];
  best_sellers_rank: { rank: number; category: string | null }[];
  sales_volume: string | null;
  has_variations: boolean;
}

export interface Review {
  review_id: string;
  title: string | null;
  body: string;
  rating: number | null;
  date: string | null;
  author: string | null;
  verified_purchase: boolean;
  helpful_votes: string | null;
  country: string | null;
}
export interface Reviews {
  asin: string;
  rating: number | null;
  total_ratings: number;
  rating_distribution: Record<'1' | '2' | '3' | '4' | '5', number> | null;
  customers_say: string | null;
  aspects: { name: string; mentions: number | null; sentiment: 'positive' | 'negative' | 'mixed' | null }[];
  top_reviews: Review[];
}

export interface BestSellerItem {
  rank: number;
  asin: string;
  url: string;
  title: string | null;
  image: string | null;
  price: number | null;
  currency: string;
  rating: number | null;
  total_ratings: number | null;
}
export interface BestSellersData { type: ListType; category: string; page: number; items: BestSellerItem[] }

export interface SellerProductsData { seller_id: string; page: number; has_next_page: boolean; results: SearchResult[] }
export interface CategoryProductsData { category: string; page: number; has_next_page: boolean; results: SearchResult[] }
export interface LookupData { identifier: string; results: SearchResult[] }

export interface Offer {
  is_pinned: boolean;
  condition: string | null;
  condition_note: string | null;
  price: number | null;
  original_price: number | null;
  currency: string;
  seller: { id: string | null; name: string | null; rating: number | null; positive_percent: number | null; ratings_count: number | null };
  ships_from: string | null;
  is_sold_by_amazon: boolean;
  is_fulfilled_by_amazon: boolean;
  is_prime: boolean | null;
  delivery: string | null;
}
export interface OffersData { asin: string; page: number; total_offers: number | null; offers: Offer[] }

export interface Deal {
  deal_id: string | null;
  asin: string;
  title: string | null;
  image: string | null;
  deal_price: number | null;
  list_price: number | null;
  currency: string;
  savings_percent: number | null;
  deal_badge: string | null;
  percent_claimed: number | null;
  ends_at: string | null;
  url: string;
}
export interface DealsData { page: number; deals: Deal[] }

export interface SellerProfile {
  seller_id: string;
  name: string;
  business_name: string | null;
  business_address: string | null;
  store_link: string | null;
  logo: string | null;
  rating: number | null;
  positive_percent_12m: number | null;
  ratings_count_12m: number | null;
  ratings_count_lifetime: number | null;
  star_distribution: Record<'1' | '2' | '3' | '4' | '5', number | null>;
}

export interface Category { name: string; node_id: string | null; path: string; url: string }
export interface CategoriesData { parent: string | null; categories: Category[] }

export interface AutocompleteData { query: string; suggestions: string[] }
