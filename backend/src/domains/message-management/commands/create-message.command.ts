import { CreateMessageRequest } from '../data-transfer-objects/create-message-request.dto';

export class CreateMessageCommand {
  constructor(public readonly createMessageRequest: CreateMessageRequest) {}
}
