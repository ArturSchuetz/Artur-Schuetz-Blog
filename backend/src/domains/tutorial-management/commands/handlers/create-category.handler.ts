import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { HelperService } from 'src/application/services/helper.service';

import { CreateTutorialCategoryCommand } from '../create-category.command';
import { TutorialCategory } from 'src/infrastructure/models/tutorial-category.entity';
import { TutorialCategoryCreatedEvent } from '../../events/category-created.event';
import { TutorialCategoryAggregate } from '../../aggregates/tutorial-category.aggregate';

@CommandHandler(CreateTutorialCategoryCommand)
export class CreateTutorialCategoryCommandHandler
  implements ICommandHandler<CreateTutorialCategoryCommand>
{
  private readonly logger = new Logger(CreateTutorialCategoryCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(TutorialCategory)
    private readonly categoryRepository: Repository<TutorialCategory>,
  ) {}

  async execute(command: CreateTutorialCategoryCommand): Promise<TutorialCategory> {
    const { createTutorialCategoryRequest } = command;
    const { name, position } = createTutorialCategoryRequest;
    const category = await TutorialCategoryAggregate.create(0, position, name, this.helperService.createSlug(name), null);

    const createCategory = await this.categoryRepository.save(category);
    const categoryModel =
      this.eventPublisher.mergeObjectContext(createCategory);
    categoryModel.apply(new TutorialCategoryCreatedEvent(category.getId()));
    categoryModel.commit();

    /* this.logger.log(
      `Successfully executed CreateTutorialCategoryCommand: ${JSON.stringify(
        categoryModel,
      )}`,
    ); */

    return categoryModel;
  }

}
