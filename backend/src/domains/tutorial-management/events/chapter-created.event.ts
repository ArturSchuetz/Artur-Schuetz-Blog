export class TutorialChapterCreatedEvent {
  constructor(private readonly chapterId: number) {}

  getChapterId(): number {
    return this.chapterId;
  }
}
