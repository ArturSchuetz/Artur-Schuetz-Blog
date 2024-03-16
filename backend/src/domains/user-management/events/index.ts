import { UserCreatedHandler } from './handlers/user-created.handler';
import { UserDeletedHandler } from './handlers/user-deleted.handler';
import { UserLoggedOutHandler } from './handlers/user-logged-out.handler';
import { UserUpdatedHandler } from './handlers/user-updated.handler';

export const UserEventHandlers = [
  UserCreatedHandler,
  UserDeletedHandler,
  UserLoggedOutHandler,
  UserUpdatedHandler,
];
