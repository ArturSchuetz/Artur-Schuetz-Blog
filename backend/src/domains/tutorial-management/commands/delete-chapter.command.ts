import { DeleteTutorialChapterRequest } from '../data-transfer-objects/delete-chapter-request.dto';

export class DeleteTutorialChapterCommand {
  constructor(public readonly deleteChapterRequest: DeleteTutorialChapterRequest) {}
}
