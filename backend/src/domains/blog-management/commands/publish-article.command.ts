import { PublishBlogArticleRequest } from '../data-transfer-objects/publish-article-request.dto';

export class PublishBlogArticleCommand {
  constructor(public readonly publishArticleRequest: PublishBlogArticleRequest) {}
}
