import { CreateProjectRequest } from '../data-transfer-objects/create-portfolio-project-request.dto';

export class CreateProjectCommand {
  constructor(public readonly createProjectRequest: CreateProjectRequest) {}
}
