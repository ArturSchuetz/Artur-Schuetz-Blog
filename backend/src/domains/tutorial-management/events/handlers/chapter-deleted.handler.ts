import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TutorialChapterDeletedEvent } from '../chapter-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TutorialChapterDeletedEvent)
export class TutorialChapterDeletedHandler
  implements IEventHandler<TutorialChapterDeletedEvent>
{
  private readonly logger = new Logger(TutorialChapterDeletedHandler.name);

  async handle(event: TutorialChapterDeletedEvent) {
    /* this.logger.log(`Tutorial Chapter with id ${event.getChapterId()} was deleted`); */
  }
}
