import { Listing, ListingStatus } from '@domain/listing';
import { IListingRepository } from '@domain/listing';
import { ISellerRepository } from '@domain/seller';
import { NotFoundError } from '@shared/errors';
import { logger } from '@shared/logger';
import { validateWithZod } from '@shared/utils';
import { z } from 'zod';

const createListingSchema = z.object({
  sellerId: z.string().min(1),
  agentId: z.string().min(1),
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(5000),
  priceUsd: z.number().positive(),
  priceEth: z.number().positive(),
  category: z.string().min(1),
  tags: z.array(z.string()).min(1).max(10),
});

export interface CreateListingInput {
  sellerId: string;
  agentId: string;
  title: string;
  description: string;
  priceUsd: number;
  priceEth: number;
  category: string;
  tags: string[];
}

export interface CreateListingOutput {
  listingId: string;
  status: ListingStatus;
  title: string;
  priceUsd: number;
}

export class CreateListingUseCase {
  constructor(
    private listingRepository: IListingRepository,
    private sellerRepository: ISellerRepository,
  ) {}

  async execute(input: CreateListingInput): Promise<CreateListingOutput> {
    // Validate input schema
    validateWithZod(createListingSchema, input);

    // Verify seller exists
    const seller = await this.sellerRepository.findById(input.sellerId);
    if (!seller) {
      throw new NotFoundError('Seller', input.sellerId);
    }

    // Create listing in draft status
    const listing = Listing.create(
      input.sellerId,
      input.agentId,
      input.title,
      input.description,
      input.priceUsd,
      input.priceEth,
      input.category,
      input.tags,
    );

    await this.listingRepository.save(listing);

    logger.info('Listing created successfully', {
      listingId: listing.getId(),
      sellerId: input.sellerId,
      status: listing.getStatus(),
    });

    return {
      listingId: listing.getId(),
      status: listing.getStatus(),
      title: listing.getTitle(),
      priceUsd: listing.getPriceUsd(),
    };
  }
}
