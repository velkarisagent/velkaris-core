import { v4 as uuidv4 } from 'uuid';

export enum ListingStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELISTED = 'delisted',
}

export interface ListingProps {
  id: string;
  sellerId: string;
  agentId: string;
  title: string;
  description: string;
  priceUsd: number;
  priceEth: number;
  category: string;
  tags: string[];
  status: ListingStatus;
  rating: number;
  reviewCount: number;
  soldCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export class Listing {
  private props: ListingProps;

  private constructor(props: ListingProps) {
    this.props = props;
  }

  static create(
    sellerId: string,
    agentId: string,
    title: string,
    description: string,
    priceUsd: number,
    priceEth: number,
    category: string,
    tags: string[],
  ): Listing {
    return new Listing({
      id: uuidv4(),
      sellerId,
      agentId,
      title,
      description,
      priceUsd,
      priceEth,
      category,
      tags,
      status: ListingStatus.DRAFT,
      rating: 0,
      reviewCount: 0,
      soldCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: ListingProps): Listing {
    return new Listing(props);
  }

  getId(): string {
    return this.props.id;
  }

  getSellerId(): string {
    return this.props.sellerId;
  }

  getAgentId(): string {
    return this.props.agentId;
  }

  getTitle(): string {
    return this.props.title;
  }

  getDescription(): string {
    return this.props.description;
  }

  getPriceUsd(): number {
    return this.props.priceUsd;
  }

  getPriceEth(): number {
    return this.props.priceEth;
  }

  getCategory(): string {
    return this.props.category;
  }

  getTags(): string[] {
    return this.props.tags;
  }

  getStatus(): ListingStatus {
    return this.props.status;
  }

  getRating(): number {
    return this.props.rating;
  }

  getReviewCount(): number {
    return this.props.reviewCount;
  }

  getSoldCount(): number {
    return this.props.soldCount;
  }

  publish(): void {
    this.props.status = ListingStatus.PUBLISHED;
    this.props.updatedAt = new Date();
  }

  archive(): void {
    this.props.status = ListingStatus.ARCHIVED;
    this.props.updatedAt = new Date();
  }

  delist(): void {
    this.props.status = ListingStatus.DELISTED;
    this.props.updatedAt = new Date();
  }

  updateRating(newAverage: number, reviewCount: number): void {
    this.props.rating = newAverage;
    this.props.reviewCount = reviewCount;
    this.props.updatedAt = new Date();
  }

  incrementSoldCount(): void {
    this.props.soldCount += 1;
    this.props.updatedAt = new Date();
  }

  toPersistence(): ListingProps {
    return { ...this.props };
  }
}
