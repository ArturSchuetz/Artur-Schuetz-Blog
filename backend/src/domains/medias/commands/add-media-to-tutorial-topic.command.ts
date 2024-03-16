import { AddMediaToTutorialTopicRequest } from '../data-transfer-objects/add-media-to-tutorial-topic-request.dto';

export class AddMediaToTutorialTopicCommand {
  constructor(
    public readonly addMediaToTutorialTopicRequest: AddMediaToTutorialTopicRequest,
  ) {}
}
