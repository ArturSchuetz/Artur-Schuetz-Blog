import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetBlogCategoryQuery } from '../get-category.query';
import { BlogCategory } from 'src/infrastructure/models/blog-category.entity';
import { GetBlogCategoryResponse } from '../../data-transfer-objects/get-category-response.dto';

@QueryHandler(GetBlogCategoryQuery)
export class GetBlogCategoryHandler implements IQueryHandler<GetBlogCategoryQuery> {
  private readonly logger = new Logger(GetBlogCategoryHandler.name);

  constructor(
    @InjectRepository(BlogCategory)
    private readonly categoryRepository: Repository<BlogCategory>,
  ) {}

  async execute(query: GetBlogCategoryQuery): Promise<GetBlogCategoryResponse> {
    /* this.logger.log(`Handling GetBlogCategoryQuery: ${JSON.stringify(query)}`); */

    const { categoryId } = query;

    try {
      let whereCondition;
      if (typeof categoryId === 'number') {
        // Wenn categoryId ein number ist, suche nach ID
        whereCondition = { id: categoryId };
      } else if (typeof categoryId === 'string') {
        // Prüfe, ob die categoryId vollständig numerisch ist
        if (/^\d+$/.test(categoryId)) {
          // Wenn categoryId eine Zeichenkette ist, die nur Zahlen enthält, behandele sie als numerische ID
          whereCondition = { id: parseInt(categoryId, 10) };
        } else {
          // Ansonsten gehe davon aus, dass es sich um einen Slug handelt
          whereCondition = { slug: categoryId };
        }
      }

      const category = await this.categoryRepository.findOne({
        where: whereCondition,
        relations: ['medias'],
      });

      if (!category) {
        throw new NotFoundException('Category not found');
      }

      const getCategoryResponse = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        color: category.color,
        titlePageImageId: category.titlePageImageId,
        medias: category.medias,
      } as GetBlogCategoryResponse;

      /* this.logger.log(
        `Successfully executed GetBlogCategoryQuery: ${JSON.stringify(
          getCategoryResponse,
        )}`,
      ); */

      return getCategoryResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
