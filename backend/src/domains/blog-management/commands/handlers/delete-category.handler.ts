import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteBlogCategoryCommand } from '../delete-category.command';
import { BlogCategoryDeletedEvent } from '../../events/category-deleted.event';
import { BlogCategory } from 'src/infrastructure/models/blog-category.entity';
import { BlogCategoryAggregate } from '../../aggregates/blog-category.aggregate';
import { Logger } from '@nestjs/common';

@CommandHandler(DeleteBlogCategoryCommand)
export class DeleteBlogCategoryCommandHandler
  implements ICommandHandler<DeleteBlogCategoryCommand>
{
  private readonly logger = new Logger(DeleteBlogCategoryCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(BlogCategory)
    private readonly categoryRepository: Repository<BlogCategory>,
  ) {}

  async execute(command: DeleteBlogCategoryCommand): Promise<boolean> {
    const { deleteCategoryRequest } = command;
    const { id } = deleteCategoryRequest;

    const toDelete = await this.categoryRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      return false;
    }

    const category = await BlogCategoryAggregate.create(
      toDelete.id,
      toDelete.name,
      toDelete.slug,
      toDelete.color,
      toDelete.titlePageImageId,
    );

    const deleteResult = await this.categoryRepository.delete(category.id);
    const categoryModel = this.eventPublisher.mergeObjectContext(category);
    if (deleteResult.affected.valueOf() > 0) {
      categoryModel.apply(new BlogCategoryDeletedEvent(categoryModel.getId()));
    }
    categoryModel.commit();

    /* this.logger.log(
      `Successfully executed DeleteBlogCategoryCommand: ${JSON.stringify(
        deleteCategoryRequest,
      )}`,
    ); */

    return true;
  }
}
