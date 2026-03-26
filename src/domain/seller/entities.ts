import { v4 as uuidv4 } from 'uuid';

export interface SellerProps {
  id: string;
  walletAddress: string;
  displayName: string;
  bio?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  totalSales: number;
  totalEarningsEth: number;
  onChainVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class Seller {
  private props: SellerProps;

  private constructor(props: SellerProps) {
    this.props = props;
  }

  static create(
    walletAddress: string,
    displayName: string,
    bio?: string,
  ): Seller {
    return new Seller({
      id: uuidv4(),
      walletAddress,
      displayName,
      bio,
      verified: false,
      rating: 0,
      reviewCount: 0,
      totalSales: 0,
      totalEarningsEth: 0,
      onChainVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static fromPersistence(props: SellerProps): Seller {
    return new Seller(props);
  }

  getId(): string {
    return this.props.id;
  }

  getWalletAddress(): string {
    return this.props.walletAddress;
  }

  getDisplayName(): string {
    return this.props.displayName;
  }

  getBio(): string | undefined {
    return this.props.bio;
  }

  getRating(): number {
    return this.props.rating;
  }

  getReviewCount(): number {
    return this.props.reviewCount;
  }

  getTotalSales(): number {
    return this.props.totalSales;
  }

  getTotalEarningsEth(): number {
    return this.props.totalEarningsEth;
  }

  isVerified(): boolean {
    return this.props.verified;
  }

  isOnChainVerified(): boolean {
    return this.props.onChainVerified;
  }

  verify(): void {
    this.props.verified = true;
    this.props.updatedAt = new Date();
  }

  recordOnChainVerification(): void {
    this.props.onChainVerified = true;
    this.props.updatedAt = new Date();
  }

  recordSale(earnings: number): void {
    this.props.totalSales += 1;
    this.props.totalEarningsEth += earnings;
    this.props.updatedAt = new Date();
  }

  updateRating(newAverage: number, reviewCount: number): void {
    this.props.rating = newAverage;
    this.props.reviewCount = reviewCount;
    this.props.updatedAt = new Date();
  }

  toPersistence(): SellerProps {
    return { ...this.props };
  }
}
