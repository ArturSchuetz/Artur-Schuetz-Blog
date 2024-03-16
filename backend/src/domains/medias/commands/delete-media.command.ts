import { DeleteMediaRequest } from '../data-transfer-objects/delete-media-request.dto';

export class DeleteMediaCommand {
  constructor(public readonly deleteMediaRequest: DeleteMediaRequest) {}
}
