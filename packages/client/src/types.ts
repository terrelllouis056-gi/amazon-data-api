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
  is_prime: boolean | null;
  is_sponsored: boolean;
  is_amazon_choice: boolean;
  is_best_seller: boolean;
  sales_volume: string | null;
  subtitle: string | null;
  badges: string[];
  best_seller_category: string | null;
  amazon_choice_keyword: string | null;
  deal_badge: string | null;
  sustainability: boolean;
  is_small_business: boolean;
  seller_id: string | null;
  image_large: string | null;
  authors: string[];
  publication_date: string | null;
  formats: { name: string; price: number | null; original_price: number | null }[];
  series: string | null;
  unit_price: UnitPrice | null;
  original_price_type: string | null;
  savings_percent: number | null;
  coupon: string | null;
  promotions: string[];
  more_buying_choices: { price: number | null; offers_count: number | null; text: string } | null;
  delivery: { text: string | null; fastest_text: string | null } | null;
  stock_left: number | null;
  points: Points | null;
  installments: string | null;
}
export interface UnitPrice { amount: number | null; unit: string | null; text: string }
export interface Points { amount: number; percent: number | null }
export interface Refinement { id: string; name: string; options: { name: string; value: string | null }[] }
export interface SearchPage {
  total_results: number | null;
  total_results_text: string | null;
  total_pages: number | null;
  corrected_query: string | null;
  related_searches: string[];
  refinements: Refinement[];
  sort_options: string[];
}
export interface SearchData extends SearchPage { query: string; page: number; has_next_page: boolean; results: SearchResult[] }

export interface ComparisonItem { title: string; asin: string | null; rating: number | null; total_ratings: number | null; price: number | null; attributes: Record<string, string> }
export interface RelatedItem { asin: string; title: string | null; price: number | null }

export interface Product {
  asin: string;
  title: string;
  url: string;
  brand: string | null;
  price: number | null;
  original_price: number | null;
  original_price_type: string | null;
  currency: string;
  images: string[];
  rating: number | null;
  total_ratings: number | null;
  availability: string | null;
  is_prime: boolean | null;
  is_amazon_choice: boolean;
  is_best_seller: boolean;
  about: string[];
  description: string | null;
  product_details: Record<string, string>;
  categories: string[];
  best_sellers_rank: { rank: number; category: string | null; node_id: string | null; url: string | null }[];
  sales_volume: string | null;
  has_variations: boolean;
  // catalog
  authors: { name: string; role: string | null; url: string | null }[];
  book_format: string | null;
  author_id: string | null;
  brand_store_url: string | null;
  brand_store_id: string | null;
  formats: { name: string; price: number | null; asin: string | null; used_from_price: number | null }[];
  category_path: { name: string; node_id: string | null }[];
  marketplace_id: string | null;
  product_type: string | null;
  editorial_reviews: string | null;
  about_author: string | null;
  // media
  parent_asin: string | null;
  variations: {
    count: number;
    dimensions: { key: string; name: string; values: { value: string; available: boolean | null }[] }[];
    items: { asin: string; attributes: Record<string, string>; url: string }[];
    selected: Record<string, string>;
  } | null;
  images_by_variant: Record<string, string[]>;
  image_variants: string[];
  videos: { title: string | null; url: string; thumbnail: string | null; duration_seconds: number | null; width: number | null; height: number | null }[];
  video_count: number | null;
  customer_videos: { title: string | null; creator: string | null; url: string }[];
  // offer
  buybox: { seller_id: string | null; seller_name: string | null; ships_from: string | null; is_sold_by_amazon: boolean | null; is_fulfilled_by_amazon: boolean | null; return_policy: string | null; seller_ratings_count: number | null } | null;
  unit_price: UnitPrice | null;
  savings_percent: number | null;
  buying_options: { type: 'NEW' | 'USED' | 'RENEWED'; price: number | null; condition_note: string | null }[];
  subscribe_save_price: number | null;
  points: Points | null;
  tax_included: boolean | null;
  offers_count: number | null;
  lowest_offer_price: number | null;
  lowest_offer_text: string | null;
  stock_left: number | null;
  condition: string | null;
  max_order_quantity: number | null;
  // promo
  coupon: string | null;
  promotions: string[];
  deal: { badge: string; ends_in: string | null } | null;
  badges: string[];
  delivery: { text: string | null; date: string | null; price: string | null; fastest_text: string | null; cutoff: string | null; location: string | null } | null;
  payment_options: string[];
  service_badges: string[];
  price_hidden: boolean;
  gift_card_amounts: number[];
  // content
  aplus: { text: string | null; images: string[]; comparison: ComparisonItem[] } | null;
  brand_story: string | null;
  important_information: Record<string, string>;
  whats_in_the_box: string[];
  size_chart: Record<string, string>[];
  documents: { name: string; url: string }[];
  sustainability: string[];
  nutrition: Record<string, string>;
  energy_class: string | null;
  energy_label_url: string | null;
  product_sheet_url: string | null;
  durability_index: string | null;
  repairability_index: string | null;
  // related
  frequently_bought_together: RelatedItem[];
  related: { heading: string; items: (RelatedItem & { rating: number | null; total_ratings: number | null })[] }[];
  bundles: { title: string; price: number | null; savings_percent: number | null }[];
  newer_model: RelatedItem | null;
  brand_snapshot: { positive_percent: number | null; text: string } | null;
}

export interface Review {
  review_id: string;
  title: string | null;
  body: string;
  rating: number | null;
  date: string | null;
  date_text: string | null;
  author: string | null;
  verified_purchase: boolean;
  helpful_votes: number | null;
  helpful_votes_text: string | null;
  country: string | null;
  review_url: string | null;
  author_id: string | null;
  author_url: string | null;
  author_avatar: string | null;
  variant: Record<string, string>;
  variant_asin: string | null;
  images: string[];
  language: string | null;
  translated_from: string | null;
  is_local: boolean | null;
}
export interface Aspect {
  name: string;
  display_name: string | null;
  mentions: number | null;
  sentiment: 'positive' | 'negative' | 'mixed' | null;
  summary: string | null;
  positive: number | null;
  negative: number | null;
  mentions_percent: number | null;
  snippets: { text: string; review_id: string | null }[];
}
export interface Reviews {
  asin: string;
  rating: number | null;
  total_ratings: number;
  rating_distribution: Record<'1' | '2' | '3' | '4' | '5', number> | null;
  customers_say: string | null;
  customers_say_ai_generated: boolean;
  aspects: Aspect[];
  customer_images: string[];
  top_reviews_available: boolean;
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
  image_large: string | null;
  points: Points | null;
  energy_class: string | null;
}
export interface BestSellersData { type: ListType; category: string; page: number; items: BestSellerItem[]; title: string | null; subcategories: Category[]; has_next_page: boolean }

export interface SellerProductsData extends SearchPage { seller_id: string; page: number; has_next_page: boolean; results: SearchResult[] }
export interface CategoryProductsData extends SearchPage { category: string; page: number; has_next_page: boolean; results: SearchResult[] }
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
