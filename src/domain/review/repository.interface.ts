import { Review } from './entities';

export interface IReviewRepository {
  save(review: Review): Promise<void>;
  findById(id: string): Promise<Review | null>;
  findByOrderId(orderId: string): Promise<Review | null>;
  findByRevieweeId(revieweeId: string): Promise<Review[]>;
  findByReviewerId(reviewerId: string): Promise<Review[]>;
  findAll(): Promise<Review[]>;
  delete(id: string): Promise<void>;
}
