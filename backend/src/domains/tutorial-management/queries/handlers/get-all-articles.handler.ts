import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetTutorialArticleListResponse,
  GetTutorialArticleListPaginatedResponse,
} from '../../data-transfer-objects/get-article-list-response.dto';
import { GetAllTutorialArticlesQuery } from '../get-all-articles.query';
import { TutorialArticle } from 'src/infrastructure/models/tutorial-article.entity';

@QueryHandler(GetAllTutorialArticlesQuery)
export class GetAllTutorialArticlesHandler
  implements IQueryHandler<GetAllTutorialArticlesQuery>
{
  private readonly logger = new Logger(GetAllTutorialArticlesHandler.name);

  constructor(
    @InjectRepository(TutorialArticle)
    private readonly articleRepository: Repository<TutorialArticle>,
  ) {}

  async execute(
    query: GetAllTutorialArticlesQuery,
  ): Promise<GetTutorialArticleListPaginatedResponse> {
    /* this.logger.log(`Handling GetAllTutorialArticlesQuery: ${JSON.stringify(query)}`); */

    const { pageNumber = 1, pageSize = 10, isUserAuthenticated } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let articles: TutorialArticle[];
    let count: number;

    try {
      if (isUserAuthenticated) {
        [articles, count] = await this.articleRepository.findAndCount({
          skip: offset,
          take: pageSize,
          order: {
            position: 'ASC',
            createdAt: 'ASC',
          },
          relations: ['chapter', 'author', 'views'],
        });
      } else {
        [articles, count] = await this.articleRepository.findAndCount({
          skip: offset,
          take: pageSize,
          where: {
            isPublished: true,
          },
          order: {
            position: 'ASC',
            createdAt: 'ASC',
          },
          relations: ['chapter', 'author'],
        });
      }
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getArticleListPaginatedResponse: GetTutorialArticleListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: articles.map((article) => {
        const getArticleListResponse = new GetTutorialArticleListResponse();
        getArticleListResponse.id = article.id;
        getArticleListResponse.position = article.position;
        getArticleListResponse.position = article.position;
        getArticleListResponse.title = article.title;
        getArticleListResponse.slug = article.slug;
        getArticleListResponse.shortTitle = article.shortTitle;
        getArticleListResponse.previewHostedVideoUrl =
          article.previewHostedVideoUrl;
        getArticleListResponse.previewMediaId = article.previewMediaId;
        getArticleListResponse.previewText = article.previewText;
        getArticleListResponse.useMathJax = article.useMathJax;
        getArticleListResponse.isPublished = article.isPublished;
        getArticleListResponse.releasedAt = article.releasedAt;
        getArticleListResponse.updatedAt = article.updatedAt;
        getArticleListResponse.chapterId = article.chapterId;
        getArticleListResponse.chapter = article.chapter;
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
      `Successfully executed GetAllTutorialArticlesQuery: ${JSON.stringify(
        getArticleListPaginatedResponse,
      )}`,
    ); */

    return getArticleListPaginatedResponse;
  }
}
