export interface IPageInfo {
  previous: string;
  next: string;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface IPaginateOptions<T> {
  filterQuery?: any;
  paginatedField?: string;
  sortAscending?: boolean;
  limit?: number;
  nextPage?: string;
  previousPage?: string;
}

export interface IPagination<T> {
  data: T[];
  pageInfo: IPageInfo;
}
