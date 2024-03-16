import { CreateTutorialCategoryRequest } from '../data-transfer-objects/create-category-request.dto';

export class CreateTutorialCategoryCommand {
  constructor(public readonly createTutorialCategoryRequest: CreateTutorialCategoryRequest) {}
}
