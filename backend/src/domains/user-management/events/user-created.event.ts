export class UserCreatedEvent {
  constructor(private readonly userId: number) {}

  getUserId(): number {
    return this.userId;
  }
}
