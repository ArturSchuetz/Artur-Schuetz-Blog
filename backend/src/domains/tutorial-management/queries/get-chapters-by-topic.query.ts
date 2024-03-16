export class GetTutorialChaptersByTopicQuery {
  constructor(
    public readonly topicId: number,
    public readonly pageNumber: number,
    public readonly pageSize: number,
    public readonly isUserAuthenticated: boolean,
  ) {}
}
