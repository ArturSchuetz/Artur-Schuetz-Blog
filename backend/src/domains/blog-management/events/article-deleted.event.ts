export class BlogArticleDeletedEvent {
  constructor(private readonly articleId: number) {}

  getArticleId(): number {
    return this.articleId;
  }
}
