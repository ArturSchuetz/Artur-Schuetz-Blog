export class GetBlogArticleMetaQuery {
  constructor(
    public readonly articleId: number | string,
    public readonly isUserAuthenticated: boolean,
  ) {}
}
