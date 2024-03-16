import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BlogArticleUpdatedEvent } from '../article-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BlogArticleUpdatedEvent)
export class BlogArticleUpdatedHandler
  implements IEventHandler<BlogArticleUpdatedEvent>
{
  private readonly logger = new Logger(BlogArticleUpdatedHandler.name);

  async handle(event: BlogArticleUpdatedEvent) {
    /* this.logger.log(`Article with id ${event.getArticleId()} was updated`); */
  }
}
