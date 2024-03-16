export class TutorialArticleUpdatedEvent {
  constructor(private readonly articleId: number) {}

  getArticleId(): number {
    return this.articleId;
  }
}
