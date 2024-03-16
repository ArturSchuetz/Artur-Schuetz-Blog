export class GetTutorialArticleMetaQuery {
  constructor(
    public readonly articleId: number | string,
    public readonly isUserAuthenticated: boolean,
  ) {}
}
