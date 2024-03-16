import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserLoggedOutEvent } from '../user-logged-out.event';

@EventsHandler(UserLoggedOutEvent)
export class UserLoggedOutHandler implements IEventHandler<UserLoggedOutEvent> {
  async handle(event: UserLoggedOutEvent) {
    //console.log(`User with id ${event.getUserId()} was logged out`);
  }
}
