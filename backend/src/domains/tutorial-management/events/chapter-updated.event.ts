export class TutorialChapterUpdatedEvent {
  constructor(private readonly chapterId: number) {}

  getChapterId(): number {
    return this.chapterId;
  }
}
