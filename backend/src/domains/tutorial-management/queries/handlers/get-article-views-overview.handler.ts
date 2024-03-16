import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { GetTutorialArticleViewsOverviewQuery } from '../get-article-views-overview.query';
import { TutorialArticle } from 'src/infrastructure/models/tutorial-article.entity';
import { GetTutorialArticleViewsOverviewResponse } from '../../data-transfer-objects/get-article-views-overview-response.dto';
import { PageView } from 'src/infrastructure/models/page-view.entity';

@QueryHandler(GetTutorialArticleViewsOverviewQuery)
export class GetTutorialArticleViewsOverviewQueryHandler implements IQueryHandler<GetTutorialArticleViewsOverviewQuery> {
  private readonly logger = new Logger(GetTutorialArticleViewsOverviewQueryHandler.name);

  constructor(
    @InjectRepository(TutorialArticle)
    private readonly articleRepository: Repository<TutorialArticle>,
    @InjectRepository(PageView)
    private readonly pageViewRepository: Repository<PageView>,
  ) {}

  async execute(query: GetTutorialArticleViewsOverviewQuery): Promise<GetTutorialArticleViewsOverviewResponse> {
    /* this.logger.log(`Handling GetTutorialArticleQuery: ${JSON.stringify(query)}`); */

    const { isUserAuthenticated } = query;

    try {
      const currentDate = new Date();
      const yesterday = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(currentDate.getTime() - (24 * 7) * 60 * 60 * 1000);
      const lastMonth = new Date(currentDate.getTime() - (24 * 30) * 60 * 60 * 1000);
      const lastYear = new Date(currentDate.getTime() - (24 * 356) * 60 * 60 * 1000);

      const viewsToday = await this.pageViewRepository.count({
        where: { 
          createdAt: Between(yesterday, currentDate)
        }
      });

      const viewsLastWeek = await this.pageViewRepository.count({
        where: { 
          createdAt: Between(lastWeek, currentDate)
        }
      });

      const viewsLastMonth = await this.pageViewRepository.count({
        where: { 
          createdAt: Between(lastMonth, currentDate)
        }
      });

      const viewsLastYear = await this.pageViewRepository.count({
        where: { 
          createdAt: Between(lastYear, currentDate)
        }
      });

      const viewsAllTime = await this.pageViewRepository.count();

      const getArticleViewsOverviewResponse = {
        Today: viewsToday,
        ThisWeek: viewsLastWeek,
        ThisMonth: viewsLastMonth,
        ThisYear: viewsLastYear,
        AllTime: viewsAllTime,
      } as GetTutorialArticleViewsOverviewResponse;

      /* this.logger.log(
        `Successfully executed GetTutorialArticleQuery: ${JSON.stringify(
          getArticleResponse,
        )}`,
      ); */

      return getArticleViewsOverviewResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
