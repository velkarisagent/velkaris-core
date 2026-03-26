import { v4 as uuidv4 } from 'uuid';

export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PAID = 'paid',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DISPUTED = 'disputed',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
}

export interface OrderProps {
  id: string;
  buyerId: string;
  sellerId: string;
  listingId: string;
  agentId: string;
  status: OrderStatus;
  priceUsd: number;
  priceEth: number;
  platformFeeEth: number;
  sellerPayoutEth: number;
  transactionHash?: string;
  blockNumber?: number;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class Order {
  private props: OrderProps;

  private constructor(props: OrderProps) {
    this.props = props;
  }

  static create(
    buyerId: string,
    sellerId: string,
    listingId: string,
    agentId: string,
    priceUsd: number,
    priceEth: number,
    platformFeeEth: number,
    sellerPayoutEth: number,
  ): Order {
    return new Order({
      id: uuidv4(),
      buyerId,
      sellerId,
      listingId,
      agentId,
      status: OrderStatus.PENDING_PAYMENT,
      priceUsd,
      priceEth,
      platformFeeEth,
      sellerPayoutEth,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: OrderProps): Order {
    return new Order(props);
  }

  getId(): string {
    return this.props.id;
  }

  getBuyerId(): string {
    return this.props.buyerId;
  }

  getSellerId(): string {
    return this.props.sellerId;
  }

  getListingId(): string {
    return this.props.listingId;
  }

  getStatus(): OrderStatus {
    return this.props.status;
  }

  isPaid(): boolean {
    return this.props.status !== OrderStatus.PENDING_PAYMENT;
  }

  recordPayment(transactionHash: string, blockNumber: number): void {
    this.props.status = OrderStatus.PAID;
    this.props.transactionHash = transactionHash;
    this.props.blockNumber = blockNumber;
    this.props.updatedAt = new Date();
  }

  moveToInProgress(): void {
    this.props.status = OrderStatus.IN_PROGRESS;
    this.props.updatedAt = new Date();
  }

  complete(): void {
    this.props.status = OrderStatus.COMPLETED;
    this.props.completedAt = new Date();
    this.props.updatedAt = new Date();
  }

  dispute(): void {
    this.props.status = OrderStatus.DISPUTED;
    this.props.updatedAt = new Date();
  }

  cancel(): void {
    this.props.status = OrderStatus.CANCELLED;
    this.props.updatedAt = new Date();
  }

  refund(): void {
    this.props.status = OrderStatus.REFUNDED;
    this.props.updatedAt = new Date();
  }

  toPersistence(): OrderProps {
    return { ...this.props };
  }
}
