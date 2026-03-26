import { IOrderRepository } from '@domain/order';
import { logger } from '@shared/logger';

export class OrderService {
  constructor(
    private orderRepository: IOrderRepository,
  ) {}

  async getOrdersByBuyer(buyerId: string) {
    logger.debug('Fetching orders for buyer', { buyerId });
    return this.orderRepository.findByBuyerId(buyerId);
  }

  async getOrdersBySeller(sellerId: string) {
    logger.debug('Fetching orders for seller', { sellerId });
    return this.orderRepository.findBySellerId(sellerId);
  }

  async getOrderDetails(orderId: string) {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }
    return order;
  }
}
