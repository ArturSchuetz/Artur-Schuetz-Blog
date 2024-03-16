import { DeleteUserRequest } from '../data-transfer-objects/delete-user-request.dto';

export class DeleteUserCommand {
  constructor(public readonly deleteUserRequest: DeleteUserRequest) {}
}
