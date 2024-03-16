import { CreateMessageCommandHandler } from './handlers/create-message.handler';
import { DeleteMessageCommandHandler } from './handlers/delete-message.handler';
import { UpdateMessageCommandHandler } from './handlers/update-message.handler';
import { MarkAsReadCommandCommandHandler } from './handlers/mark-message-as-read.handler';

export const MessageCommandHandlers = [
  CreateMessageCommandHandler,
  DeleteMessageCommandHandler,
  UpdateMessageCommandHandler,
  MarkAsReadCommandCommandHandler,
];
