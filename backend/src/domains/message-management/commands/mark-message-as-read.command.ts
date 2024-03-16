import { MarkAsReadRequest } from '../data-transfer-objects/mark-message-as-read-request.dto';

export class MarkAsReadCommand {
  constructor(public readonly markAsReadRequest: MarkAsReadRequest) {}
}
