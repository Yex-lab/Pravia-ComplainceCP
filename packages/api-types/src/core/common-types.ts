// Common API response wrapper
export interface ApiResponse<T = any> {
  statusCode: number;
  body: T;
  message: string;
}

// Pagination types
export interface PaginationParams {
  page?: number;
  perPage?: number;
  maxLimit?: number;
}

export interface PaginationMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// Base entity with common fields
export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

// Common error response
export interface ErrorResponse {
  statusCode: number;
  message: string;
  error?: string;
  details?: any;
}
