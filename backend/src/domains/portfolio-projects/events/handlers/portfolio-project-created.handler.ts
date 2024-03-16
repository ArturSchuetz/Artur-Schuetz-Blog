import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { ProjectCreatedEvent } from '../portfolio-project-created.event';

@EventsHandler(ProjectCreatedEvent)
export class ProjectCreatedHandler
  implements IEventHandler<ProjectCreatedEvent>
{
  async handle(event: ProjectCreatedEvent) {
    //console.log(`Portfolio project with id ${event.getProjectId()} was created`);
  }
}
