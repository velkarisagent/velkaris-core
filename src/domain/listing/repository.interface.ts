import { Listing } from './entities';

export interface IListingRepository {
  save(listing: Listing): Promise<void>;
  findById(id: string): Promise<Listing | null>;
  findBySellerId(sellerId: string): Promise<Listing[]>;
  findByStatus(status: string): Promise<Listing[]>;
  findAll(): Promise<Listing[]>;
  delete(id: string): Promise<void>;
}
