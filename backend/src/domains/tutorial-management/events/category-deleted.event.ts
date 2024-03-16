export class TutorialCategoryDeletedEvent {
  constructor(private readonly categoryId: number) {}

  getCategoryId(): number {
    return this.categoryId;
  }
}
