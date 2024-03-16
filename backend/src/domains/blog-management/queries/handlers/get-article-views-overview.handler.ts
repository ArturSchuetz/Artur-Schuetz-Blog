import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { GetBlogArticleViewsOverviewQuery } from '../get-article-views-overview.query';
import { BlogArticle } from 'src/infrastructure/models/blog-article.entity';
import { GetBlogArticleViewsOverviewResponse } from '../../data-transfer-objects/get-article-views-overview-response.dto';
import { PageView } from 'src/infrastructure/models/page-view.entity';

@QueryHandler(GetBlogArticleViewsOverviewQuery)
export class GetBlogArticleViewsOverviewQueryHandler implements IQueryHandler<GetBlogArticleViewsOverviewQuery> {
  private readonly logger = new Logger(GetBlogArticleViewsOverviewQueryHandler.name);

  constructor(
    @InjectRepository(BlogArticle)
    private readonly articleRepository: Repository<BlogArticle>,
    @InjectRepository(PageView)
    private readonly pageViewRepository: Repository<PageView>,
  ) {}

  async execute(query: GetBlogArticleViewsOverviewQuery): Promise<GetBlogArticleViewsOverviewResponse> {
    /* this.logger.log(`Handling GetBlogArticleQuery: ${JSON.stringify(query)}`); */

    const { isUserAuthenticated } = query;

    try {
      let currentDate = new Date();
      const tomorrow = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
      const yesterday = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000);
      const lastWeek = new Date(currentDate.getTime() - (24 * 7) * 60 * 60 * 1000);
      const lastMonth = new Date(currentDate.getTime() - (24 * 30) * 60 * 60 * 1000);
      const lastYear = new Date(currentDate.getTime() - (24 * 356) * 60 * 60 * 1000);

      const viewsToday = await this.pageViewRepository.count({
        where: { 
          createdAt: Between(yesterday, tomorrow)
        }
      });

      const viewsLastWeek = await this.pageViewRepository.count({
        where: { 
          createdAt: Between(lastWeek, tomorrow)
        }
      });

      const viewsLastMonth = await this.pageViewRepository.count({
        where: { 
          createdAt: Between(lastMonth, tomorrow)
        }
      });

      const viewsLastYear = await this.pageViewRepository.count({
        where: { 
          createdAt: Between(lastYear, tomorrow)
        }
      });

      const viewsAllTime = await this.pageViewRepository.count();

      const getArticleViewsOverviewResponse = {
        Today: viewsToday,
        ThisWeek: viewsLastWeek,
        ThisMonth: viewsLastMonth,
        ThisYear: viewsLastYear,
        AllTime: viewsAllTime,
      } as GetBlogArticleViewsOverviewResponse;

      /* this.logger.log(
        `Successfully executed GetBlogArticleQuery: ${JSON.stringify(
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
