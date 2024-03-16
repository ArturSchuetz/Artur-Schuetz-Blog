export class GetBlogArticlesByCategoryQuery {
  constructor(
    public readonly categoryId: number | string,
    public readonly pageNumber: number,
    public readonly pageSize: number,
    public readonly isUserAuthenticated: boolean,
  ) {}
}
