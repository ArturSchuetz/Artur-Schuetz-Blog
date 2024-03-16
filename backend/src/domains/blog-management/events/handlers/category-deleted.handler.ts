import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BlogCategoryDeletedEvent } from '../category-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BlogCategoryDeletedEvent)
export class BlogCategoryDeletedHandler
  implements IEventHandler<BlogCategoryDeletedEvent>
{
  private readonly logger = new Logger(BlogCategoryDeletedHandler.name);

  async handle(event: BlogCategoryDeletedEvent) {
    /* this.logger.log(`Category with id ${event.getCategoryId()} was deleted`); */
  }
}
