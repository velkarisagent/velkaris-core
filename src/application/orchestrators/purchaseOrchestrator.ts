import { IOrderRepository } from '@domain/order';
import { IListingRepository } from '@domain/listing';
import { logger } from '@shared/logger';

export interface PurchaseResult {
  orderId: string;
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export class PurchaseOrchestrator {
  constructor(
    private orderRepository: IOrderRepository,
    private listingRepository: IListingRepository,
  ) {}

  async orchestratePurchase(
    orderId: string,
    transactionHash: string,
  ): Promise<PurchaseResult> {
    try {
      const order = await this.orderRepository.findById(orderId);
      if (!order) {
        return {
          orderId,
          success: false,
          error: 'Order not found',
        };
      }

      // Record payment on chain
      order.recordPayment(transactionHash, 0); // blockNumber = 0 for now
      await this.orderRepository.save(order);

      // Increment listing sold count
      const listing = await this.listingRepository.findById(
        order.getListingId(),
      );
      if (listing) {
        listing.incrementSoldCount();
        await this.listingRepository.save(listing);
      }

      logger.info('Purchase orchestration completed', {
        orderId,
        transactionHash,
      });

      return {
        orderId,
        success: true,
        transactionHash,
      };
    } catch (error) {
      logger.error('Purchase orchestration failed', {
        orderId,
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        orderId,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
