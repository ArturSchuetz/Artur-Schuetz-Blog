import { CreateTutorialTopicRequest } from '../data-transfer-objects/create-topic-request.dto';

export class CreateTutorialTopicCommand {
  constructor(public readonly createTutorialTopicRequest: CreateTutorialTopicRequest) {}
}
