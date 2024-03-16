export class GetTutorialChapterQuery {
  constructor(
    public readonly chapterId: number | string,
    public readonly isUserAuthenticated: boolean
  ) {}
}
