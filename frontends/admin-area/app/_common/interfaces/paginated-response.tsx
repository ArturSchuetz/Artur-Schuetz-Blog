export interface PaginatedResponse<T> {
  currentPage: number;
  totalCount: number;
  data: T[];
}
