import { v4 as uuidv4 } from 'uuid';

export enum ReviewStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  DISPUTED = 'disputed',
  REMOVED = 'removed',
}

export interface ReviewProps {
  id: string;
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export class Review {
  private props: ReviewProps;

  private constructor(props: ReviewProps) {
    this.props = props;
  }

  static create(
    orderId: string,
    reviewerId: string,
    revieweeId: string,
    rating: number,
    comment?: string,
  ): Review {
    return new Review({
      id: uuidv4(),
      orderId,
      reviewerId,
      revieweeId,
      rating,
      comment,
      status: ReviewStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: ReviewProps): Review {
    return new Review(props);
  }

  getId(): string {
    return this.props.id;
  }

  getOrderId(): string {
    return this.props.orderId;
  }

  getReviewerId(): string {
    return this.props.reviewerId;
  }

  getRevieweeId(): string {
    return this.props.revieweeId;
  }

  getRating(): number {
    return this.props.rating;
  }

  getComment(): string | undefined {
    return this.props.comment;
  }

  getStatus(): ReviewStatus {
    return this.props.status;
  }

  publish(): void {
    this.props.status = ReviewStatus.PUBLISHED;
    this.props.updatedAt = new Date();
  }

  dispute(): void {
    this.props.status = ReviewStatus.DISPUTED;
    this.props.updatedAt = new Date();
  }

  remove(): void {
    this.props.status = ReviewStatus.REMOVED;
    this.props.updatedAt = new Date();
  }

  toPersistence(): ReviewProps {
    return { ...this.props };
  }
}
