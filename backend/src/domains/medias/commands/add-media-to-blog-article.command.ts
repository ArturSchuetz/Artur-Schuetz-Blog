import { AddMediaToBlogArticleRequest } from '../data-transfer-objects/add-media-to-blog-article-request.dto';

export class AddMediaToBlogArticleCommand {
  constructor(
    public readonly addMediaToArticleRequest: AddMediaToBlogArticleRequest,
  ) {}
}
