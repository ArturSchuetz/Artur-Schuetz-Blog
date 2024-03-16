import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { HelperService } from 'src/application/services/helper.service';

import { UpdateTutorialCategoryCommand } from '../update-category.command';
import { TutorialCategoryUpdatedEvent } from '../../events/category-updated.event';
import { TutorialCategory } from 'src/infrastructure/models/tutorial-category.entity';
import { UpdateTutorialCategoryResponse } from '../../data-transfer-objects/update-category-response.dto';
import { TutorialCategoryAggregate } from '../../aggregates/tutorial-category.aggregate';

@CommandHandler(UpdateTutorialCategoryCommand)
export class UpdateTutorialCategoryCommandHandler
  implements ICommandHandler<UpdateTutorialCategoryCommand>
{
  private readonly logger = new Logger(UpdateTutorialCategoryCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(TutorialCategory)
    private readonly categoryRepository: Repository<TutorialCategory>,
  ) {}

  async execute(
    command: UpdateTutorialCategoryCommand,
  ): Promise<UpdateTutorialCategoryResponse> {
    const { updateTutorialCategoryRequest } = command;
    const { id, position, name, imageId } = updateTutorialCategoryRequest;

    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: ['medias'],
    });

    if (!existingCategory) {
      throw new Error('Projekt nicht gefunden');
    }

    const category = await TutorialCategoryAggregate.create(
      existingCategory.id,
      position,
      name,
      this.helperService.createSlug(name),
      imageId,
    );

    const updatedCategory = await this.categoryRepository.save(category);

    const categoryModel =
      this.eventPublisher.mergeObjectContext(updatedCategory);
    categoryModel.apply(new TutorialCategoryUpdatedEvent(id));
    categoryModel.commit();

    const updateCategoryResponse: UpdateTutorialCategoryResponse = {
      id: updatedCategory.id,
      position: updatedCategory.position,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      imageId: updatedCategory.imageId,
      medias: existingCategory.medias,
    };

    /* this.logger.log(
      `Successfully executed UpdateTutorialCategoryCommand: ${JSON.stringify(
        updateCategoryResponse,
      )}`,
    ); */

    return updateCategoryResponse;
  }
}
