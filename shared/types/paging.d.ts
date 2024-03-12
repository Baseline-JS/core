export interface PagedResponse<T> {
  data?: T[];
  pagination: {
    limit: number;
    totalRecords: number;
    nextFrom?: number;
    pages: number;
    currentPage: number;
  };
}
