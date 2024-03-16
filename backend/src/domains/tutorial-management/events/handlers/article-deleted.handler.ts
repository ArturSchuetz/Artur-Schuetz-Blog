import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TutorialArticleDeletedEvent } from '../article-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TutorialArticleDeletedEvent)
export class TutorialArticleDeletedHandler
  implements IEventHandler<TutorialArticleDeletedEvent>
{
  private readonly logger = new Logger(TutorialArticleDeletedHandler.name);

  async handle(event: TutorialArticleDeletedEvent) {
    /* this.logger.log(`Tutorial Article with id ${event.getArticleId()} was deleted`); */
  }
}
