export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

export interface Timestamps {
  createdAt: Date;
  updatedAt: Date;
}
