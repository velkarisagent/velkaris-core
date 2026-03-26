// Pricing constants
export const PLATFORM_FEE_PERCENTAGE = 0.05; // 5%
export const SELLER_PAYOUT_PERCENTAGE = 0.95; // 95%
export const MINIMUM_LISTING_PRICE = 0.001; // in ETH
export const MAXIMUM_LISTING_PRICE = 10000; // in ETH

// Order constants
export const ORDER_TIMEOUT_HOURS = 48;
export const ORDER_COMPLETION_DAYS = 7;

// Seller constants
export const MINIMUM_SELLER_RATING = 1;
export const MAXIMUM_SELLER_RATING = 5;
export const SELLER_REPUTATION_THRESHOLD = 4.0;

// Review constants
export const MINIMUM_REVIEW_RATING = 1;
export const MAXIMUM_REVIEW_RATING = 5;
export const REVIEW_DEADLINE_DAYS = 30;

// Listing constants
export const MAX_LISTING_DESCRIPTION_LENGTH = 5000;
export const MAX_LISTING_TITLE_LENGTH = 200;
export const MIN_LISTING_TAGS = 1;
export const MAX_LISTING_TAGS = 10;

// Blockchain constants
export const BASE_NETWORK_ID = 8453;
export const TRANSACTION_CONFIRMATION_BLOCKS = 12;
export const TRANSACTION_TIMEOUT_MINUTES = 5;

// Default pagination
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
