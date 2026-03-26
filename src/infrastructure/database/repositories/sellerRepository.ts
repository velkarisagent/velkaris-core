import { Seller } from '@domain/seller';
import { ISellerRepository } from '@domain/seller';
import { db } from '../connection';
import { sellersTable } from '../schema';
import { eq } from 'drizzle-orm';
import { logger } from '@shared/logger';

export class SellerRepository implements ISellerRepository {
  async save(seller: Seller): Promise<void> {
    const props = seller.toPersistence();

    try {
      await db
        .insert(sellersTable)
        .values({
          id: props.id,
          walletAddress: props.walletAddress,
          displayName: props.displayName,
          bio: props.bio,
          verified: props.verified,
          rating: props.rating.toString(),
          reviewCount: props.reviewCount,
          totalSales: props.totalSales,
          totalEarningsEth: props.totalEarningsEth.toString(),
          onChainVerified: props.onChainVerified,
          createdAt: props.createdAt,
          updatedAt: props.updatedAt,
        })
        .onConflictDoUpdate({
          target: sellersTable.id,
          set: {
            displayName: props.displayName,
            bio: props.bio,
            verified: props.verified,
            rating: props.rating.toString(),
            reviewCount: props.reviewCount,
            totalSales: props.totalSales,
            totalEarningsEth: props.totalEarningsEth.toString(),
            onChainVerified: props.onChainVerified,
            updatedAt: props.updatedAt,
          },
        });

      logger.debug('Seller saved', { sellerId: props.id });
    } catch (error) {
      logger.error('Failed to save seller', {
        sellerId: props.id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findById(id: string): Promise<Seller | null> {
    try {
      const row = await db
        .select()
        .from(sellersTable)
        .where(eq(sellersTable.id, id));

      if (row.length === 0) return null;

      const result = row[0];
      return Seller.fromPersistence({
        id: result.id,
        walletAddress: result.walletAddress,
        displayName: result.displayName,
        bio: result.bio || undefined,
        verified: result.verified,
        rating: parseFloat(result.rating),
        reviewCount: result.reviewCount,
        totalSales: result.totalSales,
        totalEarningsEth: parseFloat(result.totalEarningsEth),
        onChainVerified: result.onChainVerified,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to find seller', {
        sellerId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findByWalletAddress(walletAddress: string): Promise<Seller | null> {
    try {
      const row = await db
        .select()
        .from(sellersTable)
        .where(eq(sellersTable.walletAddress, walletAddress));

      if (row.length === 0) return null;

      const result = row[0];
      return Seller.fromPersistence({
        id: result.id,
        walletAddress: result.walletAddress,
        displayName: result.displayName,
        bio: result.bio || undefined,
        verified: result.verified,
        rating: parseFloat(result.rating),
        reviewCount: result.reviewCount,
        totalSales: result.totalSales,
        totalEarningsEth: parseFloat(result.totalEarningsEth),
        onChainVerified: result.onChainVerified,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      });
    } catch (error) {
      logger.error('Failed to find seller by wallet address', {
        walletAddress,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findAll(): Promise<Seller[]> {
    try {
      const rows = await db.select().from(sellersTable);

      return rows.map(r =>
        Seller.fromPersistence({
          id: r.id,
          walletAddress: r.walletAddress,
          displayName: r.displayName,
          bio: r.bio || undefined,
          verified: r.verified,
          rating: parseFloat(r.rating),
          reviewCount: r.reviewCount,
          totalSales: r.totalSales,
          totalEarningsEth: parseFloat(r.totalEarningsEth),
          onChainVerified: r.onChainVerified,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find all sellers', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async findVerified(): Promise<Seller[]> {
    try {
      const rows = await db.select().from(sellersTable).where(eq(sellersTable.verified, true));

      return rows.map(r =>
        Seller.fromPersistence({
          id: r.id,
          walletAddress: r.walletAddress,
          displayName: r.displayName,
          bio: r.bio || undefined,
          verified: r.verified,
          rating: parseFloat(r.rating),
          reviewCount: r.reviewCount,
          totalSales: r.totalSales,
          totalEarningsEth: parseFloat(r.totalEarningsEth),
          onChainVerified: r.onChainVerified,
          createdAt: r.createdAt,
          updatedAt: r.updatedAt,
        }),
      );
    } catch (error) {
      logger.error('Failed to find verified sellers', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await db.delete(sellersTable).where(eq(sellersTable.id, id));
      logger.debug('Seller deleted', { sellerId: id });
    } catch (error) {
      logger.error('Failed to delete seller', {
        sellerId: id,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }
}
