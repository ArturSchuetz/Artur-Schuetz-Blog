import { UpdateBlogArticleRequest } from '../data-transfer-objects/update-article-request.dto';

export class UpdateBlogArticleCommand {
  constructor(public readonly updateArticleRequest: UpdateBlogArticleRequest) {}
}
