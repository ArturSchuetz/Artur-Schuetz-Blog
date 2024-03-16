import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { DeleteTutorialCategoryCommand } from '../delete-category.command';
import { TutorialCategoryDeletedEvent } from '../../events/category-deleted.event';
import { TutorialCategory } from 'src/infrastructure/models/tutorial-category.entity';
import { TutorialCategoryAggregate } from '../../aggregates/tutorial-category.aggregate';

@CommandHandler(DeleteTutorialCategoryCommand)
export class DeleteTutorialCategoryCommandHandler
  implements ICommandHandler<DeleteTutorialCategoryCommand>
{
  private readonly logger = new Logger(DeleteTutorialCategoryCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(TutorialCategory)
    private readonly categoryRepository: Repository<TutorialCategory>,
  ) {}

  async execute(command: DeleteTutorialCategoryCommand): Promise<boolean> {
    const { deleteCategoryRequest } = command;
    const { id } = deleteCategoryRequest;

    const toDelete = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      return false;
    }

    const category = await TutorialCategoryAggregate.create(
      toDelete.id,
      toDelete.position,
      toDelete.name,
      toDelete.slug,
      toDelete.imageId,
    );

    const deleteResult = await this.categoryRepository.delete(category.id);
    const categoryModel = this.eventPublisher.mergeObjectContext(category);
    if (deleteResult.affected.valueOf() > 0) {
      categoryModel.apply(new TutorialCategoryDeletedEvent(categoryModel.getId()));
    }
    categoryModel.commit();

    /* this.logger.log(
      `Successfully executed DeleteTutorialCategoryCommand: ${JSON.stringify(
        deleteCategoryRequest,
      )}`,
    ); */

    return true;
  }
}
