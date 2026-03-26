import { Listing, ListingStatus } from '@domain/listing';
import { IListingRepository } from '@domain/listing';
import { db } from '../connection';
import { listingsTable } from '../schema';
import { eq } from 'drizzle-orm';
import { logger } from '@shared/logger';

export class ListingRepository implements IListingRepository {
  async save(listing: Listing): Promise<void> {
    const props = listing.toPersistence();
    const tags = JSON.stringify(props.tags);

    try {
      await db
        .insert(listingsTable)
        .values({
          id: props.id,
          sellerId: props.sellerId,
          agentId: props.agentId,
          title: props.title,
          description: props.description,
          priceUsd: props.priceUsd.toString(),
          priceEth: props.priceEth.toString(),
          category: props.category,
          tags,
          status: props.status,
          rating: props.rating.toString(),
          reviewCount: props.reviewCount,
          soldCount: props.soldCount,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        })
        .onConflictDoUpdate({
          target: listingsTable.id,
          set: {
            title: props.title,
            description: props.description,
            priceUsd: props.priceUsd.toString(),
            priceEth: props.priceEth.toString(),
            category: props.category,
            tags,
            status: props.status,
            rating: props.rating.toString(),
            reviewCount: props.reviewCount,
            soldCount: props.soldCount,
            updatedAt: props.updatedAt,
          },
        });

      logger.debug('Listing saved', { listingId: props.id });
    } catch (error) {
      logger.error('Failed to save listing', {
        listingId: props.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Listing | null> {
    try {
      const row = await db
        .select()
        .from(listingsTable)
        .where(eq(listingsTable.id, id));

      if (row.length === 0) return null;

      const result = row[0];
      return Listing.fromPersistence({
        id: result.id,
        sellerId: result.sellerId,
        agentId: result.agentId,
        title: result.title,
        description: result.description,
        priceUsd: parseFloat(result.priceUsd),
        priceEth: parseFloat(result.priceEth),
        category: result.category,
        tags: JSON.parse(result.tags),
        status: result.status as ListingStatus,
        rating: parseFloat(result.rating),
        reviewCount: result.reviewCount,
        soldCount: result.soldCount,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to find listing', {
        listingId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findBySellerId(sellerId: string): Promise<Listing[]> {
    try {
      const rows = await db
        .select()
        .from(listingsTable)
        .where(eq(listingsTable.sellerId, sellerId));

      return rows.map(r =>
        Listing.fromPersistence({
          id: r.id,
          sellerId: r.sellerId,
          agentId: r.agentId,
          title: r.title,
          description: r.description,
          priceUsd: parseFloat(r.priceUsd),
          priceEth: parseFloat(r.priceEth),
          category: r.category,
          tags: JSON.parse(r.tags),
          status: r.status as ListingStatus,
          rating: parseFloat(r.rating),
          reviewCount: r.reviewCount,
          soldCount: r.soldCount,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find listings by seller', {
        sellerId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findByStatus(status: ListingStatus): Promise<Listing[]> {
    try {
      const rows = await db
        .select()
        .from(listingsTable)
        .where(eq(listingsTable.status, status));

      return rows.map(r =>
        Listing.fromPersistence({
          id: r.id,
          sellerId: r.sellerId,
          agentId: r.agentId,
          title: r.title,
          description: r.description,
          priceUsd: parseFloat(r.priceUsd),
          priceEth: parseFloat(r.priceEth),
          category: r.category,
          tags: JSON.parse(r.tags),
          status: r.status as ListingStatus,
          rating: parseFloat(r.rating),
          reviewCount: r.reviewCount,
          soldCount: r.soldCount,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find listings by status', {
        status,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findAll(): Promise<Listing[]> {
    try {
      const rows = await db.select().from(listingsTable);

      return rows.map(r =>
        Listing.fromPersistence({
          id: r.id,
          sellerId: r.sellerId,
          agentId: r.agentId,
          title: r.title,
          description: r.description,
          priceUsd: parseFloat(r.priceUsd),
          priceEth: parseFloat(r.priceEth),
          category: r.category,
          tags: JSON.parse(r.tags),
          status: r.status as ListingStatus,
          rating: parseFloat(r.rating),
          reviewCount: r.reviewCount,
          soldCount: r.soldCount,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find all listings', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(listingsTable).where(eq(listingsTable.id, id));
      logger.debug('Listing deleted', { listingId: id });
    } catch (error) {
      logger.error('Failed to delete listing', {
        listingId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
