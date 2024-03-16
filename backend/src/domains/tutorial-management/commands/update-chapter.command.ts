import { UpdateTutorialChapterRequest } from '../data-transfer-objects/update-chapter-request.dto';

export class UpdateTutorialChapterCommand {
  constructor(public readonly updateTutorialChapterRequest: UpdateTutorialChapterRequest) {}
}
