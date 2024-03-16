export class BlogCategoryCreatedEvent {
  constructor(private readonly categoryId: number) {}

  getCategoryId(): number {
    return this.categoryId;
  }
}
