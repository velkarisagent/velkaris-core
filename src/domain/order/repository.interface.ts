import { Order } from './entities';

export interface IOrderRepository {
  save(order: Order): Promise<void>;
  findById(id: string): Promise<Order | null>;
  findByBuyerId(buyerId: string): Promise<Order[]>;
  findBySellerId(sellerId: string): Promise<Order[]>;
  findByStatus(status: string): Promise<Order[]>;
  findAll(): Promise<Order[]>;
  delete(id: string): Promise<void>;
}
