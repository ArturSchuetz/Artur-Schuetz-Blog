export class MessageUpdatedEvent {
  constructor(private readonly messageId: number) {}

  getMessageId(): number {
    return this.messageId;
  }
}
