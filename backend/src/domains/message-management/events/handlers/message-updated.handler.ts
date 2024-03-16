import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MessageUpdatedEvent } from '../message-updated.event';

@EventsHandler(MessageUpdatedEvent)
export class MessageUpdatedHandler
  implements IEventHandler<MessageUpdatedEvent>
{
  async handle(event: MessageUpdatedEvent) {
    //console.log(`Message with id ${event.getMessageId()} was updated`);
  }
}
