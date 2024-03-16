import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from '../user-created.event';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  async handle(event: UserCreatedEvent) {
    //console.log(`User with id ${event.getUserId()} was created`);
  }
}
