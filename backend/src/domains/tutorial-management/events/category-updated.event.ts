export class TutorialCategoryUpdatedEvent {
  constructor(private readonly categoryId: number) {}

  getCategoryId(): number {
    return this.categoryId;
  }
}
