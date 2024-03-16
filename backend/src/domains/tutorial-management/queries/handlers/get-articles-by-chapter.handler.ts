import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetTutorialArticleListResponse,
  GetTutorialArticleListPaginatedResponse,
} from '../../data-transfer-objects/get-article-list-response.dto';
import { GetTutorialArticlesByChapterQuery } from '../get-articles-by-chapter.query';
import { TutorialArticle } from 'src/infrastructure/models/tutorial-article.entity';

@QueryHandler(GetTutorialArticlesByChapterQuery)
export class GetTutorialArticlesByChapterHandler
  implements IQueryHandler<GetTutorialArticlesByChapterQuery>
{
  private readonly logger = new Logger(GetTutorialArticlesByChapterHandler.name);

  constructor(
    @InjectRepository(TutorialArticle)
    private readonly articleRepository: Repository<TutorialArticle>,
  ) {}

  async execute(
    query: GetTutorialArticlesByChapterQuery,
  ): Promise<GetTutorialArticleListPaginatedResponse> {
    /* this.logger.log(
      `Handling GetTutorialArticlesByChapterQuery: ${JSON.stringify(query)}`,
    ); */

    const {
      chapterId,
      pageNumber = 1,
      pageSize = 10,
      isUserAuthenticated,
    } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let articles: TutorialArticle[];
    let count: number;

    try {
      const baseQuery = this.articleRepository
        .createQueryBuilder('tutorial_article')
        .leftJoinAndSelect('tutorial_article.chapter', 'chapter')
        .where('chapter.id = :chapterId', { chapterId })
        .where('chapter.slug = :chapterId', { chapterId })
        .skip(offset)
        .take(pageSize)
        .orderBy('tutorial_article.position', 'ASC');

      if (isUserAuthenticated) {
        [articles, count] = await baseQuery
          .getManyAndCount();
      } else {
        [articles, count] = await baseQuery
          .andWhere('tutorial_article.isPublished = :isPublished', { isPublished: true })
          .getManyAndCount();
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
        return getArticleListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetTutorialArticlesByChapterQuery: ${JSON.stringify(
        getArticleListPaginatedResponse,
      )}`,
    ); */

    return getArticleListPaginatedResponse;
  }
}
