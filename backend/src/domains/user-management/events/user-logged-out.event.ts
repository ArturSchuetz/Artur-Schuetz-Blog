export class UserLoggedOutEvent {
  constructor(private readonly userId: number) {}

  getUserId(): number {
    return this.userId;
  }
}
