import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TutorialCategoryDeletedEvent } from '../category-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(TutorialCategoryDeletedEvent)
export class TutorialCategoryDeletedHandler
  implements IEventHandler<TutorialCategoryDeletedEvent>
{
  private readonly logger = new Logger(TutorialCategoryDeletedHandler.name);

  async handle(event: TutorialCategoryDeletedEvent) {
    /* this.logger.log(`Tutorial Category with id ${event.getCategoryId()} was deleted`); */
  }
}
