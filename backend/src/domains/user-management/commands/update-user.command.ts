import { UpdateUserRequest } from '../data-transfer-objects/update-user-request.dto';

export class UpdateUserCommand {
  constructor(public readonly updateUserRequest: UpdateUserRequest) {}
}
