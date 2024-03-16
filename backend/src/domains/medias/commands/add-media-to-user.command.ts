import { AddMediaToUserRequest } from '../data-transfer-objects/add-media-to-user-request.dto';

export class AddMediaToUserCommand {
  constructor(public readonly addMediaToUserRequest: AddMediaToUserRequest) {}
}
