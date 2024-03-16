import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBlogCategoryCommand } from '../update-category.command';
import { BlogCategoryUpdatedEvent } from '../../events/category-updated.event';
import { BlogCategory } from 'src/infrastructure/models/blog-category.entity';
import { UpdateBlogCategoryResponse } from '../../data-transfer-objects/update-category-response.dto';
import { BlogCategoryAggregate } from '../../aggregates/blog-category.aggregate';
import { Logger } from '@nestjs/common';
import { HelperService } from 'src/application/services/helper.service';

@CommandHandler(UpdateBlogCategoryCommand)
export class UpdateBlogCategoryCommandHandler
  implements ICommandHandler<UpdateBlogCategoryCommand>
{
  private readonly logger = new Logger(UpdateBlogCategoryCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(BlogCategory)
    private readonly categoryRepository: Repository<BlogCategory>,
  ) {}

  async execute(
    command: UpdateBlogCategoryCommand,
  ): Promise<UpdateBlogCategoryResponse> {
    const { updateCategoryRequest } = command;
    const { id, name, color, titlePageImageId } = updateCategoryRequest;

    const existingCategory = await this.categoryRepository.findOne({
      where: { id },
      relations: ['medias'],
    });

    if (!existingCategory) {
      throw new Error('Projekt nicht gefunden');
    }

    const category = await BlogCategoryAggregate.create(
      existingCategory.id,
      name,
      this.helperService.createSlug(name),
      color,
      titlePageImageId,
    );

    const updatedCategory = await this.categoryRepository.save(category);

    const categoryModel =
      this.eventPublisher.mergeObjectContext(updatedCategory);
    categoryModel.apply(new BlogCategoryUpdatedEvent(id));
    categoryModel.commit();

    const updateCategoryResponse: UpdateBlogCategoryResponse = {
      id: updatedCategory.id,
      name: updatedCategory.name,
      slug: updatedCategory.slug,
      color: updatedCategory.color,
      titlePageImageId: updatedCategory.titlePageImageId,
      medias: existingCategory.medias,
    };

    /* this.logger.log(
      `Successfully executed UpdateBlogCategoryCommand: ${JSON.stringify(
        updateCategoryResponse,
      )}`,
    ); */

    return updateCategoryResponse;
  }
}
