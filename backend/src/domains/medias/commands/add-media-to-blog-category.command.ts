import { AddMediaToBlogCategoryRequest } from '../data-transfer-objects/add-media-to-blog-category-request.dto';

export class AddMediaToBlogCategoryCommand {
  constructor(
    public readonly addMediaToCategoryRequest: AddMediaToBlogCategoryRequest,
  ) {}
}
