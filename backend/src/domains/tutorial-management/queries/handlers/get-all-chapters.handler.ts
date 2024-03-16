import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetTutorialChapterListResponse,
  GetTutorialChapterListPaginatedResponse,
} from '../../data-transfer-objects/get-chapter-list-response.dto';
import { GetAllTutorialChaptersQuery } from '../get-all-chapters.query';
import { TutorialChapter } from 'src/infrastructure/models/tutorial-chapter.entity';

@QueryHandler(GetAllTutorialChaptersQuery)
export class GetAllTutorialChaptersHandler
  implements IQueryHandler<GetAllTutorialChaptersQuery>
{
  private readonly logger = new Logger(GetAllTutorialChaptersHandler.name);
  constructor(
    @InjectRepository(TutorialChapter)
    private readonly chapterRepository: Repository<TutorialChapter>,
  ) {}

  async execute(
    query: GetAllTutorialChaptersQuery,
  ): Promise<GetTutorialChapterListPaginatedResponse> {
    /* this.logger.log(`Handling GetAllTutorialChaptersQuery: ${JSON.stringify(query)}`); */

    const { pageNumber = 1, pageSize = 10 } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let chapters: TutorialChapter[];
    let count: number;

    try {
      [chapters, count] = await this.chapterRepository.findAndCount({
        skip: offset,
        take: pageSize,
        relations: ['topic'],
        order: {
          position: 'ASC',
          createdAt: 'ASC',
        },
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
        getChapterListResponse.topic = chapter.topic;
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
