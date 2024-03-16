import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TutorialCategoryUpdatedEvent } from '../category-updated.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TutorialCategoryUpdatedEvent)
export class TutorialCategoryUpdatedHandler
  implements IEventHandler<TutorialCategoryUpdatedEvent>
{
  private readonly logger = new Logger(TutorialCategoryUpdatedHandler.name);

  async handle(event: TutorialCategoryUpdatedEvent) {
    /* this.logger.log(`Tutorial Category with id ${event.getCategoryId()} was updated`); */
  }
}
