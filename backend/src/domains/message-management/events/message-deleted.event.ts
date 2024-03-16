export class MessageDeletedEvent {
  constructor(private readonly messageId: number) {}

  getMessageId(): number {
    return this.messageId;
  }
}
