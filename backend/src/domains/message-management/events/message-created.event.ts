export class MessageCreatedEvent {
  constructor(private readonly messageId: number) {}

  getMessageId(): number {
    return this.messageId;
  }
}
