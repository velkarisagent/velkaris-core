import { Seller } from './entities';

export interface ISellerRepository {
  save(seller: Seller): Promise<void>;
  findById(id: string): Promise<Seller | null>;
  findByWalletAddress(walletAddress: string): Promise<Seller | null>;
  findAll(): Promise<Seller[]>;
  findVerified(): Promise<Seller[]>;
  delete(id: string): Promise<void>;
}
