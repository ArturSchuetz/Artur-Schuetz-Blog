export class GetTutorialTopicQuery {
  constructor(
    public readonly topicId: number | string,
    public readonly isUserAuthenticated: boolean
  ) { }
}
