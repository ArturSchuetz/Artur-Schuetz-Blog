import { DeleteTutorialCategoryRequest } from '../data-transfer-objects/delete-category-request.dto';

export class DeleteTutorialCategoryCommand {
  constructor(public readonly deleteCategoryRequest: DeleteTutorialCategoryRequest) {}
}
