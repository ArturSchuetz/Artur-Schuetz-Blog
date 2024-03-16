import { UpdateProjectRequest } from '../data-transfer-objects/update-project-request.dto';

export class UpdateProjectCommand {
  constructor(public readonly updateProjectRequest: UpdateProjectRequest) {}
}
