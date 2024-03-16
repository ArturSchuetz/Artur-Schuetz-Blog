import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MediaCreatedEvent } from '../media-created.event';

@EventsHandler(MediaCreatedEvent)
export class MediaCreatedHandler implements IEventHandler<MediaCreatedEvent> {
  async handle(event: MediaCreatedEvent) {
    //console.log(`Media with id ${event.getMediaId()} was created`);
  }
}
