import { CreateUserRequest } from '../data-transfer-objects/create-user-request.dto';

export class CreateUserCommand {
  constructor(public readonly createUserRequest: CreateUserRequest) {}
}
