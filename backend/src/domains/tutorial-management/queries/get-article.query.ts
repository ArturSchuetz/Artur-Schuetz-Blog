export class GetTutorialArticleQuery {
  constructor(
    public readonly articleId: number | string,
    public readonly isUserAuthenticated: boolean,
  ) {}
}
