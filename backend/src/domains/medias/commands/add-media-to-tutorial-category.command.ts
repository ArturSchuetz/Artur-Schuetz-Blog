import { AddMediaToTutorialCategoryRequest } from '../data-transfer-objects/add-media-to-tutorial-category-request.dto';

export class AddMediaToTutorialCategoryCommand {
  constructor(
    public readonly addMediaToTutorialCategoryRequest: AddMediaToTutorialCategoryRequest,
  ) {}
}
