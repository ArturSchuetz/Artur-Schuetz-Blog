import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TutorialChapterCreatedEvent } from '../chapter-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TutorialChapterCreatedEvent)
export class TutorialChapterCreatedHandler
  implements IEventHandler<TutorialChapterCreatedEvent>
{
  private readonly logger = new Logger(TutorialChapterCreatedHandler.name);

  async handle(event: TutorialChapterCreatedEvent) {
    /* this.logger.log(`Tutorial Chapter with id ${event.getChapterId()} was created`); */
  }
}
