export class TutorialArticleDeletedEvent {
  constructor(private readonly articleId: number) {}

  getArticleId(): number {
    return this.articleId;
  }
}
