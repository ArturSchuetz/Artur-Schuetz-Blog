import { ProjectCreatedHandler } from './handlers/portfolio-project-created.handler';
import { ProjectDeletedHandler } from './handlers/portfolio-project-deleted.handler';
import { ProjectUpdatedHandler } from './handlers/portfolio-project-updated.handler';

export const ProjectEventHandlers = [
  ProjectCreatedHandler,
  ProjectDeletedHandler,
  ProjectUpdatedHandler,
];
