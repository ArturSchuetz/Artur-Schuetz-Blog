import { DeleteMessageRequest } from '../data-transfer-objects/delete-message-request.dto';

export class DeleteMessageCommand {
  constructor(public readonly deleteMessageRequest: DeleteMessageRequest) {}
}
