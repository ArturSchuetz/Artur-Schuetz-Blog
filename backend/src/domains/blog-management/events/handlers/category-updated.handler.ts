import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BlogCategoryUpdatedEvent } from '../category-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BlogCategoryUpdatedEvent)
export class BlogCategoryUpdatedHandler
  implements IEventHandler<BlogCategoryUpdatedEvent>
{
  private readonly logger = new Logger(BlogCategoryUpdatedHandler.name);

  async handle(event: BlogCategoryUpdatedEvent) {
    /* this.logger.log(`Category with id ${event.getCategoryId()} was updated`); */
  }
}
