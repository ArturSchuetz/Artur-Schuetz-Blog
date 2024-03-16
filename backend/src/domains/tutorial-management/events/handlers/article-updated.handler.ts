import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TutorialArticleUpdatedEvent } from '../article-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TutorialArticleUpdatedEvent)
export class TutorialArticleUpdatedHandler
  implements IEventHandler<TutorialArticleUpdatedEvent>
{
  private readonly logger = new Logger(TutorialArticleUpdatedHandler.name);

  async handle(event: TutorialArticleUpdatedEvent) {
    /* this.logger.log(`Tutorial Article with id ${event.getArticleId()} was updated`); */
  }
}
