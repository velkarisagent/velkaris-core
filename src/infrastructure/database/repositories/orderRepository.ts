import { Order, OrderStatus } from '@domain/order';
import { IOrderRepository } from '@domain/order';
import { db } from '../connection';
import { ordersTable } from '../schema';
import { eq } from 'drizzle-orm';
import { logger } from '@shared/logger';

export class OrderRepository implements IOrderRepository {
  async save(order: Order): Promise<void> {
    const props = order.toPersistence();

    try {
      await db
        .insert(ordersTable)
        .values({
          id: props.id,
          buyerId: props.buyerId,
          sellerId: props.sellerId,
          listingId: props.listingId,
          agentId: props.agentId,
          status: props.status,
          priceUsd: props.priceUsd.toString(),
          priceEth: props.priceEth.toString(),
          platformFeeEth: props.platformFeeEth.toString(),
          sellerPayoutEth: props.sellerPayoutEth.toString(),
          transactionHash: props.transactionHash,
          blockNumber: props.blockNumber,
          completedAt: props.completedAt,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        })
        .onConflictDoUpdate({
          target: ordersTable.id,
          set: {
            status: props.status,
            transactionHash: props.transactionHash,
            blockNumber: props.blockNumber,
            completedAt: props.completedAt,
            updatedAt: props.updatedAt,
          },
        });

      logger.debug('Order saved', { orderId: props.id });
    } catch (error) {
      logger.error('Failed to save order', {
        orderId: props.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Order | null> {
    try {
      const row = await db.select().from(ordersTable).where(eq(ordersTable.id, id));

      if (row.length === 0) return null;

      const result = row[0];
      return Order.fromPersistence({
        id: result.id,
        buyerId: result.buyerId,
        sellerId: result.sellerId,
        listingId: result.listingId,
        agentId: result.agentId,
        status: result.status as OrderStatus,
        priceUsd: parseFloat(result.priceUsd),
        priceEth: parseFloat(result.priceEth),
        platformFeeEth: parseFloat(result.platformFeeEth),
        sellerPayoutEth: parseFloat(result.sellerPayoutEth),
        transactionHash: result.transactionHash || undefined,
        blockNumber: result.blockNumber || undefined,
        completedAt: result.completedAt || undefined,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to find order', {
        orderId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findByBuyerId(buyerId: string): Promise<Order[]> {
    try {
      const rows = await db
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.buyerId, buyerId));

      return rows.map(r =>
        Order.fromPersistence({
          id: r.id,
          buyerId: r.buyerId,
          sellerId: r.sellerId,
          listingId: r.listingId,
          agentId: r.agentId,
          status: r.status as OrderStatus,
          priceUsd: parseFloat(r.priceUsd),
          priceEth: parseFloat(r.priceEth),
          platformFeeEth: parseFloat(r.platformFeeEth),
          sellerPayoutEth: parseFloat(r.sellerPayoutEth),
          transactionHash: r.transactionHash || undefined,
          blockNumber: r.blockNumber || undefined,
          completedAt: r.completedAt || undefined,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find orders by buyer', {
        buyerId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findBySellerId(sellerId: string): Promise<Order[]> {
    try {
      const rows = await db
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.sellerId, sellerId));

      return rows.map(r =>
        Order.fromPersistence({
          id: r.id,
          buyerId: r.buyerId,
          sellerId: r.sellerId,
          listingId: r.listingId,
          agentId: r.agentId,
          status: r.status as OrderStatus,
          priceUsd: parseFloat(r.priceUsd),
          priceEth: parseFloat(r.priceEth),
          platformFeeEth: parseFloat(r.platformFeeEth),
          sellerPayoutEth: parseFloat(r.sellerPayoutEth),
          transactionHash: r.transactionHash || undefined,
          blockNumber: r.blockNumber || undefined,
          completedAt: r.completedAt || undefined,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find orders by seller', {
        sellerId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      const rows = await db
        .select()
        .from(ordersTable)
        .where(eq(ordersTable.status, status));

      return rows.map(r =>
        Order.fromPersistence({
          id: r.id,
          buyerId: r.buyerId,
          sellerId: r.sellerId,
          listingId: r.listingId,
          agentId: r.agentId,
          status: r.status as OrderStatus,
          priceUsd: parseFloat(r.priceUsd),
          priceEth: parseFloat(r.priceEth),
          platformFeeEth: parseFloat(r.platformFeeEth),
          sellerPayoutEth: parseFloat(r.sellerPayoutEth),
          transactionHash: r.transactionHash || undefined,
          blockNumber: r.blockNumber || undefined,
          completedAt: r.completedAt || undefined,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find orders by status', {
        status,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findAll(): Promise<Order[]> {
    try {
      const rows = await db.select().from(ordersTable);

      return rows.map(r =>
        Order.fromPersistence({
          id: r.id,
          buyerId: r.buyerId,
          sellerId: r.sellerId,
          listingId: r.listingId,
          agentId: r.agentId,
          status: r.status as OrderStatus,
          priceUsd: parseFloat(r.priceUsd),
          priceEth: parseFloat(r.priceEth),
          platformFeeEth: parseFloat(r.platformFeeEth),
          sellerPayoutEth: parseFloat(r.sellerPayoutEth),
          transactionHash: r.transactionHash || undefined,
          blockNumber: r.blockNumber || undefined,
          completedAt: r.completedAt || undefined,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find all orders', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(ordersTable).where(eq(ordersTable.id, id));
      logger.debug('Order deleted', { orderId: id });
    } catch (error) {
      logger.error('Failed to delete order', {
        orderId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
