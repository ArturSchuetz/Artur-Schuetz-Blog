export class BlogCategoryDeletedEvent {
  constructor(private readonly categoryId: number) {}

  getCategoryId(): number {
    return this.categoryId;
  }
}
