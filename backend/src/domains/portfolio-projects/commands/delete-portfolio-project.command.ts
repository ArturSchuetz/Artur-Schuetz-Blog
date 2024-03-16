import { DeleteProjectRequest } from '../data-transfer-objects/delete-portfolio-project-request.dto';

export class DeleteProjectCommand {
  constructor(public readonly deleteProjectRequest: DeleteProjectRequest) {}
}
