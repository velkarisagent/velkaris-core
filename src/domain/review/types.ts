export enum ReviewStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  DISPUTED = 'disputed',
  REMOVED = 'removed',
}

export interface CreateReviewDTO {
  orderId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
}
