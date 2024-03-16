import { LogoutUserRequest } from '../data-transfer-objects/logout-user-request.dto';

export class LogoutUserCommand {
  constructor(public readonly logoutUserRequest: LogoutUserRequest) {}
}
