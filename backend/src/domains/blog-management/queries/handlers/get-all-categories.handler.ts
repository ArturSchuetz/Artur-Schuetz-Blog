import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetBlogCategoryListResponse,
  GetCategoryListPaginatedResponse,
} from '../../data-transfer-objects/get-category-list-response.dto';
import { GetAllBlogCategoriesQuery } from '../get-all-categories.query';
import { BlogCategory } from 'src/infrastructure/models/blog-category.entity';

@QueryHandler(GetAllBlogCategoriesQuery)
export class GetAllBlogCategoriesHandler
  implements IQueryHandler<GetAllBlogCategoriesQuery>
{
  private readonly logger = new Logger(GetAllBlogCategoriesHandler.name);
  constructor(
    @InjectRepository(BlogCategory)
    private readonly categoryRepository: Repository<BlogCategory>,
  ) {}

  async execute(
    query: GetAllBlogCategoriesQuery,
  ): Promise<GetCategoryListPaginatedResponse> {
    /* this.logger.log(`Handling GetAllBlogCategoriesQuery: ${JSON.stringify(query)}`); */

    const { pageNumber = 1, pageSize = 10 } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let categories: BlogCategory[];
    let count: number;

    try {
      [categories, count] = await this.categoryRepository.findAndCount({
        skip: offset,
        take: pageSize,
      });
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getCategoryListPaginatedResponse: GetCategoryListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: categories.map((category) => {
        const getCategoryListResponse = new GetBlogCategoryListResponse();
        getCategoryListResponse.id = category.id;
        getCategoryListResponse.name = category.name;
        getCategoryListResponse.slug = category.slug;
        getCategoryListResponse.color = category.color;
        getCategoryListResponse.titlePageImageId = category.titlePageImageId;
        return getCategoryListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetAllBlogCategoriesQuery: ${JSON.stringify(
        getCategoryListPaginatedResponse,
      )}`,
    ); */

    return getCategoryListPaginatedResponse;
  }
}
