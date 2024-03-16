export class UserDeletedEvent {
  constructor(private readonly userId: number) {}

  getUserId(): number {
    return this.userId;
  }
}
