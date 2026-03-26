import { describe, it, expect } from 'vitest';
import { Order, OrderStatus } from '../../src/domain/order';

describe('Order Domain Entity', () => {
  it('should create order in pending payment state', () => {
    const order = Order.create(
      'buyer-1',
      'seller-1',
      'listing-1',
      'agent-1',
      100,
      0.04,
      0.002,
      0.038,
    );

    expect(order.getId()).toBeDefined();
    expect(order.getStatus()).toBe(OrderStatus.PENDING_PAYMENT);
    expect(order.isPaid()).toBe(false);
  });

  it('should transition through order lifecycle', () => {
    const order = Order.create(
      'buyer-2',
      'seller-2',
      'listing-2',
      'agent-2',
      50,
      0.02,
      0.001,
      0.019,
    );

    order.recordPayment('0xabc123', 1000001);
    expect(order.getStatus()).toBe(OrderStatus.PAID);
    expect(order.isPaid()).toBe(true);

    order.moveToInProgress();
    expect(order.getStatus()).toBe(OrderStatus.IN_PROGRESS);

    order.complete();
    expect(order.getStatus()).toBe(OrderStatus.COMPLETED);
  });

  it('should handle order disputes', () => {
    const order = Order.create(
      'buyer-3',
      'seller-3',
      'listing-3',
      'agent-3',
      200,
      0.08,
      0.004,
      0.076,
    );

    order.recordPayment('0xtxhash', 2000000);
    order.moveToInProgress();
    order.dispute();

    expect(order.getStatus()).toBe(OrderStatus.DISPUTED);
  });
});
