import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TutorialArticleCreatedEvent } from '../article-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TutorialArticleCreatedEvent)
export class TutorialArticleCreatedHandler
  implements IEventHandler<TutorialArticleCreatedEvent>
{
  private readonly logger = new Logger(TutorialArticleCreatedHandler.name);

  async handle(event: TutorialArticleCreatedEvent) {
    /* this.logger.log(`Tutorial Article with id ${event.getArticleId()} was created`); */
  }
}
