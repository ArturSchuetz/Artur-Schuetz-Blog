import { AddMediaToProjectRequest } from '../data-transfer-objects/add-media-to-project-request.dto';

export class AddMediaToProjectCommand {
  constructor(
    public readonly addMediaToProjectRequest: AddMediaToProjectRequest,
  ) {}
}
