import { ISellerRepository } from '@domain/seller';
import { IListingRepository } from '@domain/listing';
import { NotFoundError } from '@shared/errors';
import { logger } from '@shared/logger';

export interface SellerDashboardOutput {
  sellerId: string;
  displayName: string;
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalEarningsEth: number;
  activeListings: number;
  verified: boolean;
}

export class GetSellerDashboardUseCase {
  constructor(
    private sellerRepository: ISellerRepository,
    private listingRepository: IListingRepository,
  ) {}

  async execute(sellerId: string): Promise<SellerDashboardOutput> {
    // Fetch seller
    const seller = await this.sellerRepository.findById(sellerId);
    if (!seller) {
      throw new NotFoundError('Seller', sellerId);
    }

    // Fetch active listings
    const listings = await this.listingRepository.findBySellerId(sellerId);
    const activeListings = listings.filter(l => l.getStatus() === 'published').length;

    logger.info('Seller dashboard retrieved', {
      sellerId,
      displayName: seller.getDisplayName(),
    });

    return {
      sellerId: seller.getId(),
      displayName: seller.getDisplayName(),
      rating: seller.getRating(),
      reviewCount: seller.getReviewCount(),
      totalSales: seller.getTotalSales(),
      totalEarningsEth: seller.getTotalEarningsEth(),
      activeListings,
      verified: seller.isVerified(),
    };
  }
}
