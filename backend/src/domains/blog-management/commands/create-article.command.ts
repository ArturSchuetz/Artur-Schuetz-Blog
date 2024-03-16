import { CreateBlogArticleRequest } from '../data-transfer-objects/create-article-request.dto';

export class CreateBlogArticleCommand {
  constructor(public readonly createArticleRequest: CreateBlogArticleRequest) {}
}
