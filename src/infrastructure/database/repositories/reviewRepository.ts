import { Review, ReviewStatus } from '@domain/review';
import { IReviewRepository } from '@domain/review';
import { db } from '../connection';
import { reviewsTable } from '../schema';
import { eq } from 'drizzle-orm';
import { logger } from '@shared/logger';

export class ReviewRepository implements IReviewRepository {
  async save(review: Review): Promise<void> {
    const props = review.toPersistence();

    try {
      await db
        .insert(reviewsTable)
        .values({
          id: props.id,
          orderId: props.orderId,
          reviewerId: props.reviewerId,
          revieweeId: props.revieweeId,
          rating: props.rating,
          comment: props.comment,
          status: props.status,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        })
        .onConflictDoUpdate({
          target: reviewsTable.id,
          set: {
            rating: props.rating,
            comment: props.comment,
            status: props.status,
            updatedAt: props.updatedAt,
          },
        });

      logger.debug('Review saved', { reviewId: props.id });
    } catch (error) {
      logger.error('Failed to save review', {
        reviewId: props.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Review | null> {
    try {
      const row = await db.select().from(reviewsTable).where(eq(reviewsTable.id, id));

      if (row.length === 0) return null;

      const result = row[0];
      return Review.fromPersistence({
        id: result.id,
        orderId: result.orderId,
        reviewerId: result.reviewerId,
        revieweeId: result.revieweeId,
        rating: result.rating,
        comment: result.comment || undefined,
        status: result.status as ReviewStatus,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to find review', {
        reviewId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findByOrderId(orderId: string): Promise<Review | null> {
    try {
      const row = await db
        .select()
        .from(reviewsTable)
        .where(eq(reviewsTable.orderId, orderId));

      if (row.length === 0) return null;

      const result = row[0];
      return Review.fromPersistence({
        id: result.id,
        orderId: result.orderId,
        reviewerId: result.reviewerId,
        revieweeId: result.revieweeId,
        rating: result.rating,
        comment: result.comment || undefined,
        status: result.status as ReviewStatus,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to find review by order', {
        orderId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findByRevieweeId(revieweeId: string): Promise<Review[]> {
    try {
      const rows = await db
        .select()
        .from(reviewsTable)
        .where(eq(reviewsTable.revieweeId, revieweeId));

      return rows.map(r =>
        Review.fromPersistence({
          id: r.id,
          orderId: r.orderId,
          reviewerId: r.reviewerId,
          revieweeId: r.revieweeId,
          rating: r.rating,
          comment: r.comment || undefined,
          status: r.status as ReviewStatus,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find reviews by reviewee', {
        revieweeId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findByReviewerId(reviewerId: string): Promise<Review[]> {
    try {
      const rows = await db
        .select()
        .from(reviewsTable)
        .where(eq(reviewsTable.reviewerId, reviewerId));

      return rows.map(r =>
        Review.fromPersistence({
          id: r.id,
          orderId: r.orderId,
          reviewerId: r.reviewerId,
          revieweeId: r.revieweeId,
          rating: r.rating,
          comment: r.comment || undefined,
          status: r.status as ReviewStatus,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find reviews by reviewer', {
        reviewerId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findAll(): Promise<Review[]> {
    try {
      const rows = await db.select().from(reviewsTable);

      return rows.map(r =>
        Review.fromPersistence({
          id: r.id,
          orderId: r.orderId,
          reviewerId: r.reviewerId,
          revieweeId: r.revieweeId,
          rating: r.rating,
          comment: r.comment || undefined,
          status: r.status as ReviewStatus,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find all reviews', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(reviewsTable).where(eq(reviewsTable.id, id));
      logger.debug('Review deleted', { reviewId: id });
    } catch (error) {
      logger.error('Failed to delete review', {
        reviewId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
