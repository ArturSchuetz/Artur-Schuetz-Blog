import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { BlogCategoryCreatedEvent } from '../category-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(BlogCategoryCreatedEvent)
export class BlogCategoryCreatedHandler
  implements IEventHandler<BlogCategoryCreatedEvent>
{
  private readonly logger = new Logger(BlogCategoryCreatedHandler.name);

  async handle(event: BlogCategoryCreatedEvent) {
    /* this.logger.log(`Category with id ${event.getCategoryId()} was created`); */
  }
}
