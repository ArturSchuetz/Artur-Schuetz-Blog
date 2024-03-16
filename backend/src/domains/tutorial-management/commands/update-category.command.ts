import { UpdateTutorialCategoryRequest } from '../data-transfer-objects/update-category-request.dto';

export class UpdateTutorialCategoryCommand {
  constructor(public readonly updateTutorialCategoryRequest: UpdateTutorialCategoryRequest) {}
}
