import { DeleteBlogArticleRequest } from '../data-transfer-objects/delete-article-request.dto';

export class DeleteBlogArticleCommand {
  constructor(public readonly deleteArticleRequest: DeleteBlogArticleRequest) {}
}
