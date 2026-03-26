import { Review } from '@domain/review';
import { IReviewRepository } from '@domain/review';
import { IOrderRepository } from '@domain/order';
import { NotFoundError, ValidationError, ConflictError } from '@shared/errors';
import { logger } from '@shared/logger';
import { MAXIMUM_REVIEW_RATING, MINIMUM_REVIEW_RATING } from '@shared/constants';

export interface SubmitReviewInput {
  orderId: string;
  reviewerId: string;
  rating: number;
  comment?: string;
}

export interface SubmitReviewOutput {
  reviewId: string;
  rating: number;
  status: string;
}

export class SubmitReviewUseCase {
  constructor(
    private reviewRepository: IReviewRepository,
    private orderRepository: IOrderRepository,
  ) {}

  async execute(input: SubmitReviewInput): Promise<SubmitReviewOutput> {
    // Validate rating
    if (
      input.rating < MINIMUM_REVIEW_RATING ||
      input.rating > MAXIMUM_REVIEW_RATING
    ) {
      throw new ValidationError('Rating must be between 1 and 5', {
        rating: input.rating,
      });
    }

    // Fetch and validate order
    const order = await this.orderRepository.findById(input.orderId);
    if (!order) {
      throw new NotFoundError('Order', input.orderId);
    }

    if (order.getBuyerId() !== input.reviewerId) {
      throw new ValidationError('Only the buyer can review this order', {
        orderId: input.orderId,
        reviewerId: input.reviewerId,
      });
    }

    // Check if review already exists
    const existingReview = await this.reviewRepository.findByOrderId(
      input.orderId,
    );
    if (existingReview) {
      throw new ConflictError('Review already exists for this order', {
        orderId: input.orderId,
      });
    }

    // Create review
    const review = Review.create(
      input.orderId,
      input.reviewerId,
      order.getSellerId(),
      input.rating,
      input.comment,
    );

    await this.reviewRepository.save(review);

    logger.info('Review submitted successfully', {
      reviewId: review.getId(),
      orderId: input.orderId,
      rating: input.rating,
    });

    return {
      reviewId: review.getId(),
      rating: review.getRating(),
      status: review.getStatus(),
    };
  }
}
