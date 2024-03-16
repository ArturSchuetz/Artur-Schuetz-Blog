import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BlogArticleCreatedEvent } from '../article-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BlogArticleCreatedEvent)
export class BlogArticleCreatedHandler
  implements IEventHandler<BlogArticleCreatedEvent>
{
  private readonly logger = new Logger(BlogArticleCreatedHandler.name);

  async handle(event: BlogArticleCreatedEvent) {
    /* this.logger.log(`Article with id ${event.getArticleId()} was created`); */
  }
}
