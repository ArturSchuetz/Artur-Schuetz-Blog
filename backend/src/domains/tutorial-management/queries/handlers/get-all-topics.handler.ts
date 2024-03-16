import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetTutorialTopicListResponse,
  GetTutorialTopicListPaginatedResponse,
} from '../../data-transfer-objects/get-topic-list-response.dto';
import { GetAllTutorialTopicsQuery } from '../get-all-topics.query';
import { TutorialTopic } from 'src/infrastructure/models/tutorial-topic.entity';

@QueryHandler(GetAllTutorialTopicsQuery)
export class GetAllTutorialTopicsHandler
  implements IQueryHandler<GetAllTutorialTopicsQuery>
{
  private readonly logger = new Logger(GetAllTutorialTopicsHandler.name);
  constructor(
    @InjectRepository(TutorialTopic)
    private readonly topicRepository: Repository<TutorialTopic>,
  ) {}

  async execute(
    query: GetAllTutorialTopicsQuery,
  ): Promise<GetTutorialTopicListPaginatedResponse> {
    /* this.logger.log(`Handling GetAllTutorialTopicsQuery: ${JSON.stringify(query)}`); */

    const { pageNumber = 1, pageSize = 10 } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let topics: TutorialTopic[];
    let count: number;

    try {
      [topics, count] = await this.topicRepository.findAndCount({
        skip: offset,
        take: pageSize,
        order: {
          position: 'ASC',
          createdAt: 'ASC',
        },
        relations: ['category', 'chapters'],
      });
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getTopicListPaginatedResponse: GetTutorialTopicListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: topics.map((topic) => {
        const getTopicListResponse = new GetTutorialTopicListResponse();
        getTopicListResponse.id = topic.id;
        getTopicListResponse.position = topic.position;
        getTopicListResponse.position = topic.position;
        getTopicListResponse.name = topic.name;
        getTopicListResponse.description = topic.description;
        getTopicListResponse.slug = topic.slug;
        getTopicListResponse.color = topic.color;
        getTopicListResponse.imageId = topic.imageId;
        getTopicListResponse.category = topic.category;
        getTopicListResponse.categoryId = topic.categoryId;
        getTopicListResponse.chapters = topic.chapters;
        return getTopicListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetAllTutorialTopicsQuery: ${JSON.stringify(
        getTopicListPaginatedResponse,
      )}`,
    ); */

    return getTopicListPaginatedResponse;
  }
}
