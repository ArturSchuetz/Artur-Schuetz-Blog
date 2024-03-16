export class GetAllBlogArticlesQuery {
  constructor(
    public readonly pageNumber: number,
    public readonly pageSize: number,
    public readonly isUserAuthenticated: boolean,
  ) {}
}
