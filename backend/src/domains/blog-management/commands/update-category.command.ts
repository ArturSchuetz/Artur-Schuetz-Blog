import { UpdateBlogCategoryRequest } from '../data-transfer-objects/update-category-request.dto';

export class UpdateBlogCategoryCommand {
  constructor(public readonly updateCategoryRequest: UpdateBlogCategoryRequest) {}
}
