import { UpdateTutorialTopicRequest } from '../data-transfer-objects/update-topic-request.dto';

export class UpdateTutorialTopicCommand {
  constructor(public readonly updateTutorialTopicRequest: UpdateTutorialTopicRequest) {}
}
