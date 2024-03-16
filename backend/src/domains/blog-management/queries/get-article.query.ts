export class GetBlogArticleQuery {
  constructor(
    public readonly articleId: number | string,
    public readonly isUserAuthenticated: boolean,
  ) {}
}
