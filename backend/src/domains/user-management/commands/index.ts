import { CreateUserCommandHandler } from './handlers/create-user.handler';
import { DeleteUserCommandHandler } from './handlers/delete-user.handler';
import { LoginUserCommandHandler } from './handlers/login-user.handler';
import { LogoutUserCommandHandler } from './handlers/logout-user.handler';
import { RefreshTokenCommandHandler } from './handlers/refresh-token.handler';
import { UpdateUserCommandHandler } from './handlers/update-user.handler';

export const UserCommandHandlers = [
  CreateUserCommandHandler,
  DeleteUserCommandHandler,
  LoginUserCommandHandler,
  LogoutUserCommandHandler,
  RefreshTokenCommandHandler,
  UpdateUserCommandHandler,
];
