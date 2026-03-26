export interface PriceQuote {
  priceUsd: number;
  priceEth: number;
  platformFeeEth: number;
  sellerPayoutEth: number;
  exchangeRate: number;
}

export interface PricingRequest {
  usdAmount: number;
  ethAmount?: number;
  includeEthConversion?: boolean;
}
