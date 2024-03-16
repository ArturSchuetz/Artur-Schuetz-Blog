import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetTutorialChapterListResponse,
  GetTutorialChapterListPaginatedResponse,
} from '../../data-transfer-objects/get-chapter-list-response.dto';
import { TutorialChapter } from 'src/infrastructure/models/tutorial-chapter.entity';
import { GetTutorialChaptersByTopicQuery } from '../get-chapters-by-topic.query';

@QueryHandler(GetTutorialChaptersByTopicQuery)
export class GetTutorialChaptersByTopicHandler
  implements IQueryHandler<GetTutorialChaptersByTopicQuery>
{
  private readonly logger = new Logger(GetTutorialChaptersByTopicHandler.name);
  constructor(
    @InjectRepository(TutorialChapter)
    private readonly chapterRepository: Repository<TutorialChapter>,
  ) {}

  async execute(
    query: GetTutorialChaptersByTopicQuery,
  ): Promise<GetTutorialChapterListPaginatedResponse> {
    /* this.logger.log(`Handling GetTutorialChaptersByTopicQuery: ${JSON.stringify(query)}`); */

    const { topicId, pageNumber = 1, pageSize = 10 } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let chapters: TutorialChapter[];
    let count: number;

    try {

      let whereCondition;
      if (typeof topicId === 'number') {
        whereCondition = { id: topicId };
      } else if (typeof topicId === 'string') {
        whereCondition = { topicId: parseInt(topicId, 10) };
      }

      [chapters, count] = await this.chapterRepository.findAndCount({
        where: whereCondition,
        skip: offset,
        take: pageSize,
        order: {
          position: 'ASC',
          createdAt: 'ASC',
        },
        relations: [
          'articles',
        ],
      });
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getChapterListPaginatedResponse: GetTutorialChapterListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: chapters.map((chapter) => {
        const getChapterListResponse = new GetTutorialChapterListResponse();
        getChapterListResponse.id = chapter.id;
        getChapterListResponse.position = chapter.position;
        getChapterListResponse.name = chapter.name;
        getChapterListResponse.slug = chapter.slug;
        getChapterListResponse.imageId = chapter.imageId;
        getChapterListResponse.topicId = chapter.topicId;
        getChapterListResponse.articles = chapter.articles;
        return getChapterListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetAllTutorialChaptersQuery: ${JSON.stringify(
        getChapterListPaginatedResponse,
      )}`,
    ); */

    return getChapterListPaginatedResponse;
  }
}
