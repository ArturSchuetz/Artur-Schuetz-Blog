import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectDeletedEvent } from '../portfolio-project-deleted.event';

@EventsHandler(ProjectDeletedEvent)
export class ProjectDeletedHandler
  implements IEventHandler<ProjectDeletedEvent>
{
  async handle(event: ProjectDeletedEvent) {
    //console.log(`Portfolio project with id ${event.getProjectId()} was deleted`);
  }
}
