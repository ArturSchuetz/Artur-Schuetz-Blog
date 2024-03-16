export class TutorialArticleCreatedEvent {
  constructor(private readonly articleId: number) {}

  getArticleId(): number {
    return this.articleId;
  }
}
