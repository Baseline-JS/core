import { PagedResponse } from '@baseline/types/paging';

export interface PageDataParams<T> {
  items: T[];
  limit: string | number;
  offset: string | number;
}

export function pageData<T>(params: PageDataParams<T>): PagedResponse<T> {
  const limit = parseInt(`${params.limit}`) || 10;
  const offset = parseInt(`${params.offset}`) || 0;
  const items = params.items;
  return {
    data: items.slice(offset, offset + limit),
    pagination: {
      limit: limit,
      totalRecords: items.length,
      nextFrom: offset + limit < items.length ? offset + limit : undefined,
      pages: parseInt(`${Math.ceil(items.length / limit) - 1}`),
      currentPage: parseInt(`${offset / limit}`),
    },
  };
}
