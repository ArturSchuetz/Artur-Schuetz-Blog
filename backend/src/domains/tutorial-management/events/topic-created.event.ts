export class TutorialTopicCreatedEvent {
  constructor(private readonly topicId: number) {}

  getTopicId(): number {
    return this.topicId;
  }
}
