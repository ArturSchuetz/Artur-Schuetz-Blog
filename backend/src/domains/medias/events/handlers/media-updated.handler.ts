import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { MediaUpdatedEvent } from '../media-updated.event';

@EventsHandler(MediaUpdatedEvent)
export class MediaUpdatedHandler implements IEventHandler<MediaUpdatedEvent> {
  async handle(event: MediaUpdatedEvent) {
    //console.log(`Media with id ${event.getMediaId()} was updated`);
  }
}
