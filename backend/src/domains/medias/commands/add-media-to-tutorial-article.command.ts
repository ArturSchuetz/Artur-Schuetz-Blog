import { AddMediaToTutorialArticleRequest } from '../data-transfer-objects/add-media-to-tutorial-article-request.dto';

export class AddMediaToTutorialArticleCommand {
  constructor(
    public readonly addMediaToTutorialArticleRequest: AddMediaToTutorialArticleRequest,
  ) {}
}
