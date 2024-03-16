import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserUpdatedEvent } from '../user-updated.event';

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  async handle(event: UserUpdatedEvent) {
    //console.log(`User with id ${event.getUserId()} was updated`);
  }
}
