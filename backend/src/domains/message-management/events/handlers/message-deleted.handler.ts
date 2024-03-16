import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MessageDeletedEvent } from '../message-deleted.event';

@EventsHandler(MessageDeletedEvent)
export class MessageDeletedHandler
  implements IEventHandler<MessageDeletedEvent>
{
  async handle(event: MessageDeletedEvent) {
    //console.log(`Message with id ${event.getMessageId()} was deleted`);
  }
}
