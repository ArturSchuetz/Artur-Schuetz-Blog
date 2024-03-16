import { UpdateMessageRequest } from '../data-transfer-objects/update-message-request.dto';

export class UpdateMessageCommand {
  constructor(public readonly updateMessageRequest: UpdateMessageRequest) {}
}
