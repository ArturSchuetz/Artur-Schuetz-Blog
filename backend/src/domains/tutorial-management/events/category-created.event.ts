export class TutorialCategoryCreatedEvent {
  constructor(private readonly categoryId: number) {}

  getCategoryId(): number {
    return this.categoryId;
  }
}
