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
  title: string;
  body: string;
  rating: number;
  date: string;
  author: string;
  verified_purchase: boolean;
  helpful_votes: string;
  country: string;
}
export interface Reviews {
  asin: string;
  rating: number | null;
  total_ratings: number;
  rating_distribution: Record<string, number> | null;
  customers_say: string | null;
  aspects: { name: string; mentions: number; sentiment: 'positive' | 'negative' | 'mixed' | null }[];
  top_reviews: Review[];
}

export interface BestSellerItem {
  rank: number;
  asin: string;
  url: string;
  title: string | null;
  image: string | null;
  price: number | null;
  currency: string | null;
  rating: number | null;
  total_ratings: number | null;
}
export interface BestSellersData { type: ListType; category: string; page: number; items: BestSellerItem[] }
