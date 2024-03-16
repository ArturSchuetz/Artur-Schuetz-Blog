import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MessageCreatedEvent } from '../message-created.event';

@EventsHandler(MessageCreatedEvent)
export class MessageCreatedHandler
  implements IEventHandler<MessageCreatedEvent>
{
  async handle(event: MessageCreatedEvent) {
    //console.log(`Message with id ${event.getMessageId()} was created`);
  }
}
