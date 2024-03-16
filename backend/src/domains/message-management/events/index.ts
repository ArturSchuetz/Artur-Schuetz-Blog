import { MessageCreatedHandler } from './handlers/message-created.handler';
import { MessageDeletedHandler } from './handlers/message-deleted.handler';
import { MessageUpdatedHandler } from './handlers/message-updated.handler';

export const MessageEventHandlers = [
  MessageCreatedHandler,
  MessageDeletedHandler,
  MessageUpdatedHandler,
];
