import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TutorialCategoryCreatedEvent } from '../category-created.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TutorialCategoryCreatedEvent)
export class TutorialCategoryCreatedHandler
  implements IEventHandler<TutorialCategoryCreatedEvent>
{
  private readonly logger = new Logger(TutorialCategoryCreatedHandler.name);

  async handle(event: TutorialCategoryCreatedEvent) {
    /* this.logger.log(`Tutorial Category with id ${event.getCategoryId()} was created`); */
  }
}
