export interface SellerDTO {
  id: string;
  walletAddress: string;
  displayName: string;
  bio?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalEarningsEth: number;
  onChainVerified: boolean;
}

export interface CreateSellerDTO {
  walletAddress: string;
  displayName: string;
  bio?: string;
}
