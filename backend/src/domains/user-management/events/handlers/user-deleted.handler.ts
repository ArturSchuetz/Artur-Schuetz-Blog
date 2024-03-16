import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserDeletedEvent } from '../user-deleted.event';

@EventsHandler(UserDeletedEvent)
export class UserDeletedHandler implements IEventHandler<UserDeletedEvent> {
  async handle(event: UserDeletedEvent) {
    //console.log(`User with id ${event.getUserId()} was deleted`);
  }
}
