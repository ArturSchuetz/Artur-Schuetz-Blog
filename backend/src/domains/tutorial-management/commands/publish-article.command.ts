import { PublishTutorialArticleRequest } from '../data-transfer-objects/publish-article-request.dto';

export class PublishTutorialArticleCommand {
  constructor(public readonly publishTutorialArticleRequest: PublishTutorialArticleRequest) {}
}
