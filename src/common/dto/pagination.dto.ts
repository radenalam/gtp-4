export class PaginationDto {
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;

  constructor({
    page,
    size,
    totalItems,
  }: {
    page: number;
    size: number;
    totalItems: number;
  }) {
    this.page = page;
    this.size = size;
    this.totalItems = totalItems;
    this.totalPages = Math.ceil(totalItems / size);
  }
}
