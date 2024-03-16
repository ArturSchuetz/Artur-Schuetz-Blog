import { CreateBlogCategoryRequest } from '../data-transfer-objects/create-category-request.dto';

export class CreateBlogCategoryCommand {
  constructor(public readonly createCategoryRequest: CreateBlogCategoryRequest) {}
}
