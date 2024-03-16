import { CreateTutorialChapterRequest } from '../data-transfer-objects/create-chapter-request.dto';

export class CreateTutorialChapterCommand {
  constructor(public readonly createTutorialChapterRequest: CreateTutorialChapterRequest) {}
}
