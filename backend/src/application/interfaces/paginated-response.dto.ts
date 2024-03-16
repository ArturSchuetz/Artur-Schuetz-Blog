export interface PaginatedResponse<T> {
  data: T[];
  currentPage: number;
  totalCount: number;
}
