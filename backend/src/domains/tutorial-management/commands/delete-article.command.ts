import { DeleteTutorialArticleRequest } from '../data-transfer-objects/delete-article-request.dto';

export class DeleteTutorialArticleCommand {
  constructor(public readonly deleteTutorialArticleRequest: DeleteTutorialArticleRequest) {}
}
