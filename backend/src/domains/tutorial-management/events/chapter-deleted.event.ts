export class TutorialChapterDeletedEvent {
  constructor(private readonly chapterId: number) {}

  getChapterId(): number {
    return this.chapterId;
  }
}
