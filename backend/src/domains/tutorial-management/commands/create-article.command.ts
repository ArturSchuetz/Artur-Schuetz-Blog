import { CreateTutorialArticleRequest } from '../data-transfer-objects/create-article-request.dto';

export class CreateTutorialArticleCommand {
  constructor(public readonly createTutorialArticleRequest: CreateTutorialArticleRequest) {}
}
