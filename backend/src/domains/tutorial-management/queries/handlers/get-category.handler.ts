import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTutorialCategoryQuery } from '../get-category.query';
import { TutorialCategory } from 'src/infrastructure/models/tutorial-category.entity';
import { GetTutorialCategoryResponse } from '../../data-transfer-objects/get-category-response.dto';

@QueryHandler(GetTutorialCategoryQuery)
export class GetTutorialCategoryHandler implements IQueryHandler<GetTutorialCategoryQuery> {
  private readonly logger = new Logger(GetTutorialCategoryHandler.name);

  constructor(
    @InjectRepository(TutorialCategory)
    private readonly categoryRepository: Repository<TutorialCategory>,
  ) {}

  async execute(query: GetTutorialCategoryQuery): Promise<GetTutorialCategoryResponse> {
    /* this.logger.log(`Handling GetTutorialCategoryQuery: ${JSON.stringify(query)}`); */

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
        position: category.position,
        name: category.name,
        slug: category.slug,
        imageId: category.imageId,
        medias: category.medias,
      } as GetTutorialCategoryResponse;

      /* this.logger.log(
        `Successfully executed GetTutorialCategoryQuery: ${JSON.stringify(
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
