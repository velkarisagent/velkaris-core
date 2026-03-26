import { Order } from '@domain/order';
import { IOrderRepository } from '@domain/order';
import { IListingRepository } from '@domain/listing';
import { ISellerRepository } from '@domain/seller';
import { PricingCalculator } from '@domain/pricing';
import { NotFoundError, ValidationError } from '@shared/errors';
import { logger } from '@shared/logger';

export interface PurchaseListingInput {
  buyerId: string;
  listingId: string;
  priceUsd: number;
}

export interface PurchaseListingOutput {
  orderId: string;
  priceEth: number;
  platformFeeEth: number;
  sellerPayoutEth: number;
}

export class PurchaseListingUseCase {
  private pricingCalculator: PricingCalculator;

  constructor(
    private orderRepository: IOrderRepository,
    private listingRepository: IListingRepository,
    private sellerRepository: ISellerRepository,
  ) {
    this.pricingCalculator = new PricingCalculator();
  }

  async execute(input: PurchaseListingInput): Promise<PurchaseListingOutput> {
    if (!input.buyerId || !input.listingId || input.priceUsd <= 0) {
      throw new ValidationError('Invalid purchase parameters', {
        buyerId: input.buyerId,
        listingId: input.listingId,
        priceUsd: input.priceUsd,
      });
    }

    // Fetch listing
    const listing = await this.listingRepository.findById(input.listingId);
    if (!listing) {
      throw new NotFoundError('Listing', input.listingId);
    }

    // Fetch seller
    const seller = await this.sellerRepository.findById(listing.getSellerId());
    if (!seller) {
      throw new NotFoundError('Seller', listing.getSellerId());
    }

    // Calculate pricing
    const priceQuote = this.pricingCalculator.calculateQuote({
      usdAmount: input.priceUsd,
    });

    // Create order
    const order = Order.create(
      input.buyerId,
      listing.getSellerId(),
      input.listingId,
      listing.getAgentId(),
      priceQuote.priceUsd,
      priceQuote.priceEth,
      priceQuote.platformFeeEth,
      priceQuote.sellerPayoutEth,
    );

    await this.orderRepository.save(order);

    logger.info('Purchase order created', {
      orderId: order.getId(),
      buyerId: input.buyerId,
      listingId: input.listingId,
      priceEth: priceQuote.priceEth,
    });

    return {
      orderId: order.getId(),
      priceEth: priceQuote.priceEth,
      platformFeeEth: priceQuote.platformFeeEth,
      sellerPayoutEth: priceQuote.sellerPayoutEth,
    };
  }
}
