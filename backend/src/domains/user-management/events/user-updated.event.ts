export class UserUpdatedEvent {
  constructor(private readonly userId: number) {}

  getUserId(): number {
    return this.userId;
  }
}
