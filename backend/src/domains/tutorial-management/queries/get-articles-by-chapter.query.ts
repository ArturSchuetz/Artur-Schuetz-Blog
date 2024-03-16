export class GetTutorialArticlesByChapterQuery {
  constructor(
    public readonly chapterId: number | string,
    public readonly pageNumber: number,
    public readonly pageSize: number,
    public readonly isUserAuthenticated: boolean,
  ) {}
}
