import { DeleteBlogCategoryRequest } from '../data-transfer-objects/delete-category-request.dto';

export class DeleteBlogCategoryCommand {
  constructor(public readonly deleteCategoryRequest: DeleteBlogCategoryRequest) {}
}
