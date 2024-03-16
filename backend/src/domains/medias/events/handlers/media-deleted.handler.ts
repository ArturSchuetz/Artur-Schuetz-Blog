import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MediaDeletedEvent } from '../media-deleted.event';

@EventsHandler(MediaDeletedEvent)
export class MediaDeletedHandler implements IEventHandler<MediaDeletedEvent> {
  async handle(event: MediaDeletedEvent) {
    //console.log(`Media with id ${event.getMediaId()} was deleted`);
  }
}
