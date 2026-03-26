export enum ListingStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
  DELISTED = 'delisted',
}

export interface CreateListingDTO {
  sellerId: string;
  agentId: string;
  title: string;
  description: string;
  priceUsd: number;
  priceEth: number;
  category: string;
  tags: string[];
}

export interface UpdateListingDTO {
  title?: string;
  description?: string;
  priceUsd?: number;
  priceEth?: number;
  category?: string;
  tags?: string[];
  status?: ListingStatus;
}
