export class TutorialTopicDeletedEvent {
  constructor(private readonly topicId: number) {}

  getCategoryId(): number {
    return this.topicId;
  }
}
