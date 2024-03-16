export class TutorialTopicUpdatedEvent {
  constructor(private readonly topicId: number) {}

  getTopicId(): number {
    return this.topicId;
  }
}
