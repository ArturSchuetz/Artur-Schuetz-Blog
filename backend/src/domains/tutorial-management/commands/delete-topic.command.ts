import { DeleteTutorialTopicRequest } from '../data-transfer-objects/delete-topic-request.dto';

export class DeleteTutorialTopicCommand {
  constructor(public readonly deleteTopicRequest: DeleteTutorialTopicRequest) {}
}
