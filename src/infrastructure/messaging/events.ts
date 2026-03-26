import { DomainEvent } from './eventBus';

export const DOMAIN_EVENTS = {
  ORDER_CREATED: 'order.created',
  ORDER_PAID: 'order.paid',
  ORDER_COMPLETED: 'order.completed',
  LISTING_CREATED: 'listing.created',
  LISTING_PUBLISHED: 'listing.published',
  SELLER_REGISTERED: 'seller.registered',
  REVIEW_SUBMITTED: 'review.submitted',
  PAYMENT_PROCESSED: 'payment.processed',
} as const;

export interface OrderCreatedEvent extends DomainEvent {
  type: typeof DOMAIN_EVENTS.ORDER_CREATED;
  data: {
    orderId: string;
    buyerId: string;
    sellerId: string;
    listingId: string;
    priceEth: number;
  };
}

export interface OrderPaidEvent extends DomainEvent {
  type: typeof DOMAIN_EVENTS.ORDER_PAID;
  data: {
    orderId: string;
    transactionHash: string;
    blockNumber: number;
  };
}

export interface OrderCompletedEvent extends DomainEvent {
  type: typeof DOMAIN_EVENTS.ORDER_COMPLETED;
  data: {
    orderId: string;
    completedAt: string;
  };
}

export interface ListingCreatedEvent extends DomainEvent {
  type: typeof DOMAIN_EVENTS.LISTING_CREATED;
  data: {
    listingId: string;
    sellerId: string;
    title: string;
    priceUsd: number;
  };
}

export interface SellerRegisteredEvent extends DomainEvent {
  type: typeof DOMAIN_EVENTS.SELLER_REGISTERED;
  data: {
    sellerId: string;
    walletAddress: string;
    displayName: string;
  };
}
