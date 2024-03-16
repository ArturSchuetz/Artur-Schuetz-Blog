import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetTutorialCategoryListResponse,
  GetTutorialCategoryListPaginatedResponse,
} from '../../data-transfer-objects/get-category-list-response.dto';
import { GetAllTutorialCategoriesQuery } from '../get-all-categories.query';
import { TutorialCategory } from 'src/infrastructure/models/tutorial-category.entity';

@QueryHandler(GetAllTutorialCategoriesQuery)
export class GetAllTutorialCategoriesHandler
  implements IQueryHandler<GetAllTutorialCategoriesQuery>
{
  private readonly logger = new Logger(GetAllTutorialCategoriesHandler.name);
  constructor(
    @InjectRepository(TutorialCategory)
    private readonly categoryRepository: Repository<TutorialCategory>,
  ) {}

  async execute(
    query: GetAllTutorialCategoriesQuery,
  ): Promise<GetTutorialCategoryListPaginatedResponse> {
    /* this.logger.log(`Handling GetAllTutorialCategoriesQuery: ${JSON.stringify(query)}`); */

    const { pageNumber = 1, pageSize = 10 } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let categories: TutorialCategory[];
    let count: number;

    try {
      [categories, count] = await this.categoryRepository.findAndCount({
        skip: offset,
        take: pageSize,
        order: {
          position: 'ASC',
          createdAt: 'ASC',
        },
      });
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getCategoryListPaginatedResponse: GetTutorialCategoryListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: categories.map((category) => {
        const getCategoryListResponse = new GetTutorialCategoryListResponse();
        getCategoryListResponse.id = category.id;
        getCategoryListResponse.position = category.position;
        getCategoryListResponse.name = category.name;
        getCategoryListResponse.slug = category.slug;
        getCategoryListResponse.imageId = category.imageId;
        return getCategoryListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetAllTutorialCategoriesQuery: ${JSON.stringify(
        getCategoryListPaginatedResponse,
      )}`,
    ); */

    return getCategoryListPaginatedResponse;
  }
}
