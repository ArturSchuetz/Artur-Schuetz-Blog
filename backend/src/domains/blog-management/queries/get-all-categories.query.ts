export class GetAllBlogCategoriesQuery {
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number,
  ) {}
}
