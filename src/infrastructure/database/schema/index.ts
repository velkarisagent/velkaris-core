import {
  pgTable,
  text,
  varchar,
  numeric,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core';

export const agentsTable = pgTable('agents', {
  id: varchar('id', { length: 36 }).primaryKey(),
  ownerId: varchar('owner_id', { length: 36 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description').notNull(),
  version: varchar('version', { length: 50 }).notNull().default('1.0.0'),
  capabilities: text('capabilities').notNull(), // JSON array as string
  verified: boolean('verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const sellersTable = pgTable('sellers', {
  id: varchar('id', { length: 36 }).primaryKey(),
  walletAddress: varchar('wallet_address', { length: 42 }).notNull().unique(),
  displayName: varchar('display_name', { length: 255 }).notNull(),
  bio: text('bio'),
  verified: boolean('verified').notNull().default(false),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('0'),
  reviewCount: integer('review_count').notNull().default(0),
  totalSales: integer('total_sales').notNull().default(0),
  totalEarningsEth: numeric('total_earnings_eth', {
    precision: 20,
    scale: 18,
  })
    .notNull()
    .default('0'),
  onChainVerified: boolean('on_chain_verified').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const listingsTable = pgTable('listings', {
  id: varchar('id', { length: 36 }).primaryKey(),
  sellerId: varchar('seller_id', { length: 36 })
    .notNull()
    .references(() => sellersTable.id),
  agentId: varchar('agent_id', { length: 36 }).notNull(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description').notNull(),
  priceUsd: numeric('price_usd', { precision: 15, scale: 2 }).notNull(),
  priceEth: numeric('price_eth', { precision: 20, scale: 18 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(),
  tags: text('tags').notNull(), // JSON array as string
  status: varchar('status', {
    length: 50,
    enum: ['draft', 'published', 'archived', 'delisted'],
  })
    .notNull()
    .default('draft'),
  rating: numeric('rating', { precision: 3, scale: 2 }).notNull().default('0'),
  reviewCount: integer('review_count').notNull().default(0),
  soldCount: integer('sold_count').notNull().default(0),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const ordersTable = pgTable('orders', {
  id: varchar('id', { length: 36 }).primaryKey(),
  buyerId: varchar('buyer_id', { length: 36 }).notNull(),
  sellerId: varchar('seller_id', { length: 36 })
    .notNull()
    .references(() => sellersTable.id),
  listingId: varchar('listing_id', { length: 36 })
    .notNull()
    .references(() => listingsTable.id),
  agentId: varchar('agent_id', { length: 36 }).notNull(),
  status: varchar('status', {
    length: 50,
    enum: [
      'pending_payment',
      'paid',
      'in_progress',
      'completed',
      'disputed',
      'cancelled',
      'refunded',
    ],
  })
    .notNull()
    .default('pending_payment'),
  priceUsd: numeric('price_usd', { precision: 15, scale: 2 }).notNull(),
  priceEth: numeric('price_eth', { precision: 20, scale: 18 }).notNull(),
  platformFeeEth: numeric('platform_fee_eth', { precision: 20, scale: 18 }).notNull(),
  sellerPayoutEth: numeric('seller_payout_eth', {
    precision: 20,
    scale: 18,
  }).notNull(),
  transactionHash: varchar('transaction_hash', { length: 66 }),
  blockNumber: integer('block_number'),
  completedAt: timestamp('completed_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const reviewsTable = pgTable('reviews', {
  id: varchar('id', { length: 36 }).primaryKey(),
  orderId: varchar('order_id', { length: 36 })
    .notNull()
    .references(() => ordersTable.id)
    .unique(),
  reviewerId: varchar('reviewer_id', { length: 36 }).notNull(),
  revieweeId: varchar('reviewee_id', { length: 36 }).notNull(),
  rating: integer('rating').notNull(),
  comment: text('comment'),
  status: varchar('status', {
    length: 50,
    enum: ['pending', 'published', 'disputed', 'removed'],
  })
    .notNull()
    .default('pending'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});
