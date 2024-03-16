import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetBlogArticleListResponse,
  GetArticleListPaginatedResponse,
} from '../../data-transfer-objects/get-article-list-response.dto';
import { GetAllBlogArticlesQuery } from '../get-all-articles.query';
import { BlogArticle } from 'src/infrastructure/models/blog-article.entity';

@QueryHandler(GetAllBlogArticlesQuery)
export class GetAllBlogArticlesHandler
  implements IQueryHandler<GetAllBlogArticlesQuery>
{
  private readonly logger = new Logger(GetAllBlogArticlesHandler.name);

  constructor(
    @InjectRepository(BlogArticle)
    private readonly articleRepository: Repository<BlogArticle>,
  ) {}

  async execute(
    query: GetAllBlogArticlesQuery,
  ): Promise<GetArticleListPaginatedResponse> {
    /* this.logger.log(`Handling GetAllBlogArticlesQuery: ${JSON.stringify(query)}`); */

    const { pageNumber = 1, pageSize = 10, isUserAuthenticated } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let articles: BlogArticle[];
    let count: number;

    try {
      if (isUserAuthenticated) {
        [articles, count] = await this.articleRepository.findAndCount({
          skip: offset,
          take: pageSize,
          relations: ['category', 'author', 'views'],
          order: {
            createdAt: 'DESC',
          },
        });
      } else {
        [articles, count] = await this.articleRepository.findAndCount({
          skip: offset,
          take: pageSize,
          relations: ['category', 'author'],
          where: {
            isPublished: true,
          },
          order: {
            releasedAt: 'DESC',
          },
        });
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
        getArticleListResponse.author = {
          id: article.author.id,
          firstName: article.author.firstName,
          lastName: article.author.lastName,
          avatarImageId: article.author.avatarImageId,
        };

        if(article.views != null) {
          getArticleListResponse.views = article.views.length;
        } else {
          getArticleListResponse.views = 0;
        }

        return getArticleListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetAllBlogArticlesQuery: ${JSON.stringify(
        getArticleListPaginatedResponse,
      )}`,
    ); */

    return getArticleListPaginatedResponse;
  }
}
