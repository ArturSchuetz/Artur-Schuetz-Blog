import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogCategoryCommand } from '../create-category.command';
import { BlogCategory } from 'src/infrastructure/models/blog-category.entity';
import { BlogCategoryCreatedEvent } from '../../events/category-created.event';
import { BlogCategoryAggregate } from '../../aggregates/blog-category.aggregate';
import { HelperService } from 'src/application/services/helper.service';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateBlogCategoryCommand)
export class CreateBlogCategoryCommandHandler
  implements ICommandHandler<CreateBlogCategoryCommand>
{
  private readonly logger = new Logger(CreateBlogCategoryCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(BlogCategory)
    private readonly categoryRepository: Repository<BlogCategory>,
  ) {}

  async execute(command: CreateBlogCategoryCommand): Promise<BlogCategory> {
    const { createCategoryRequest } = command;
    const { name, color } = createCategoryRequest;
    const category = await BlogCategoryAggregate.create(0, name, this.helperService.createSlug(name), color, null);

    const createCategory = await this.categoryRepository.save(category);
    const categoryModel =
      this.eventPublisher.mergeObjectContext(createCategory);
    categoryModel.apply(new BlogCategoryCreatedEvent(category.getId()));
    categoryModel.commit();

    /* this.logger.log(
      `Successfully executed CreateBlogCategoryCommand: ${JSON.stringify(
        categoryModel,
      )}`,
    ); */

    return categoryModel;
  }

}
