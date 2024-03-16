import { LoginUserRequest } from '../data-transfer-objects/login-user-request.dto';

export class LoginUserCommand {
  constructor(public readonly loginUserRequest: LoginUserRequest) {}
}
