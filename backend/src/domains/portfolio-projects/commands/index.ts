import { CreateProjectCommandHandler } from './handlers/create-portfolio-project.handler';
import { DeleteProjectCommandHandler } from './handlers/delete-portfolio-project.handler';
import { UpdateProjectCommandHandler } from './handlers/update-portfolio-project.handler';

export const ProjectCommandHandlers = [
  CreateProjectCommandHandler,
  DeleteProjectCommandHandler,
  UpdateProjectCommandHandler,
];
