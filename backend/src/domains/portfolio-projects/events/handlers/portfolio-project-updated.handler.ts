import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectUpdatedEvent } from '../portfolio-project-updated.event';

@EventsHandler(ProjectUpdatedEvent)
export class ProjectUpdatedHandler
  implements IEventHandler<ProjectUpdatedEvent>
{
  async handle(event: ProjectUpdatedEvent) {
    //console.log(`Portfolio project with id ${event.getProjectId()} was updated`);
  }
}
