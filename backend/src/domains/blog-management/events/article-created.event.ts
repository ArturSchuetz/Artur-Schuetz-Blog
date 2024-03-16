export class BlogArticleCreatedEvent {
  constructor(private readonly articleId: number) {}

  getArticleId(): number {
    return this.articleId;
  }
}
