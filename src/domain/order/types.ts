export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface CreateOrderDTO {
  buyerId: string;
  sellerId: string;
  listingId: string;
  agentId: string;
  priceUsd: number;
  priceEth: number;
}
