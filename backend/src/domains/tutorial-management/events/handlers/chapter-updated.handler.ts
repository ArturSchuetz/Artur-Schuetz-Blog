import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TutorialChapterUpdatedEvent } from '../chapter-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TutorialChapterUpdatedEvent)
export class TutorialChapterUpdatedHandler
  implements IEventHandler<TutorialChapterUpdatedEvent>
{
  private readonly logger = new Logger(TutorialChapterUpdatedHandler.name);

  async handle(event: TutorialChapterUpdatedEvent) {
    /* this.logger.log(`Tutorial Chapter with id ${event.getChapterId()} was updated`); */
  }
}
