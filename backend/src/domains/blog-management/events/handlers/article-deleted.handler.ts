import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BlogArticleDeletedEvent } from '../article-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BlogArticleDeletedEvent)
export class BlogArticleDeletedHandler
  implements IEventHandler<BlogArticleDeletedEvent>
{
  private readonly logger = new Logger(BlogArticleDeletedHandler.name);

  async handle(event: BlogArticleDeletedEvent) {
    /* this.logger.log(`Article with id ${event.getArticleId()} was deleted`); */
  }
}
