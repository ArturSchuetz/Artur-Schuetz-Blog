import { AddMediaToTutorialChapterRequest } from '../data-transfer-objects/add-media-to-tutorial-chapter-request.dto';

export class AddMediaToTutorialChapterCommand {
  constructor(
    public readonly addMediaToTutorialChapterRequest: AddMediaToTutorialChapterRequest,
  ) {}
}
