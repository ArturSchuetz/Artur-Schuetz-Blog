import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetBlogArticleListResponse,
  GetArticleListPaginatedResponse,
} from '../../data-transfer-objects/get-article-list-response.dto';
import { GetBlogArticlesByCategoryQuery } from '../get-articles-by-category.query';
import { BlogArticle } from 'src/infrastructure/models/blog-article.entity';

@QueryHandler(GetBlogArticlesByCategoryQuery)
export class GetBlogArticlesByCategoryHandler
  implements IQueryHandler<GetBlogArticlesByCategoryQuery>
{
  private readonly logger = new Logger(GetBlogArticlesByCategoryHandler.name);

  constructor(
    @InjectRepository(BlogArticle)
    private readonly articleRepository: Repository<BlogArticle>,
  ) {}

  async execute(
    query: GetBlogArticlesByCategoryQuery,
  ): Promise<GetArticleListPaginatedResponse> {
    /* this.logger.log(
      `Handling GetBlogArticlesByCategoryQuery: ${JSON.stringify(query)}`,
    ); */

    const {
      categoryId,
      pageNumber = 1,
      pageSize = 10,
      isUserAuthenticated,
    } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let articles: BlogArticle[];
    let count: number;

    try {
      const baseQuery = this.articleRepository
        .createQueryBuilder('blog_article')
        .leftJoinAndSelect('blog_article.category', 'category')
        .where('category.id = :categoryId', { categoryId })
        .where('category.slug = :categoryId', { categoryId })
        .skip(offset)
        .take(pageSize);

      if (isUserAuthenticated) {
        [articles, count] = await baseQuery
          .orderBy('blog_article.createdAt', 'DESC')
          .getManyAndCount();
      } else {
        [articles, count] = await baseQuery
          .orderBy('blog_article.releasedAt', 'DESC')
          .andWhere('blog_article.isPublished = :isPublished', { isPublished: true })
          .getManyAndCount();
      }
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getArticleListPaginatedResponse: GetArticleListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: articles.map((article) => {
        const getArticleListResponse = new GetBlogArticleListResponse();
        getArticleListResponse.id = article.id;
        getArticleListResponse.title = article.title;
        getArticleListResponse.slug = article.slug;
        getArticleListResponse.titlePageImageId = article.titlePageImageId;
        getArticleListResponse.previewHostedVideoUrl =
          article.previewHostedVideoUrl;
        getArticleListResponse.previewMediaId = article.previewMediaId;
        getArticleListResponse.previewText = article.previewText;
        getArticleListResponse.useMathJax = article.useMathJax;
        getArticleListResponse.isPublished = article.isPublished;
        getArticleListResponse.releasedAt = article.releasedAt;
        getArticleListResponse.updatedAt = article.updatedAt;
        getArticleListResponse.categoryId = article.categoryId;
        getArticleListResponse.category = article.category;
        getArticleListResponse.tags = article.tags;
        return getArticleListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetBlogArticlesByCategoryQuery: ${JSON.stringify(
        getArticleListPaginatedResponse,
      )}`,
    ); */

    return getArticleListPaginatedResponse;
  }
}
