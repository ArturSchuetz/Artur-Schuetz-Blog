import { UpdateTutorialArticleRequest } from '../data-transfer-objects/update-article-request.dto';

export class UpdateTutorialArticleCommand {
  constructor(public readonly updateArticleRequest: UpdateTutorialArticleRequest) {}
}
