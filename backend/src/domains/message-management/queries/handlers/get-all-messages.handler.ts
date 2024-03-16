import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetMessageListResponse,
  GetMessageListPaginatedResponse,
} from '../../data-transfer-objects/get-message-list-response.dto';
import { GetAllMessagesQuery } from '../get-all-messages.query';
import { Message } from 'src/infrastructure/models/message.entity';

@QueryHandler(GetAllMessagesQuery)
export class GetAllMessagesHandler
  implements IQueryHandler<GetAllMessagesQuery>
{
  private readonly logger = new Logger(GetAllMessagesHandler.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async execute(
    query: GetAllMessagesQuery,
  ): Promise<GetMessageListPaginatedResponse> {
    /* this.logger.log(`Handling GetAllMessagesQuery: ${JSON.stringify(query)}`); */

    const { pageNumber = 1, pageSize = 10 } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let messages: Message[];
    let count: number;

    try {
      [messages, count] = await this.messageRepository.findAndCount({
        skip: offset,
        take: pageSize,
        order: {
          id: 'DESC',
        },
      });
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getMessageListPaginatedResponse: GetMessageListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: messages.map((message) => {
        const getMessageListResponse = new GetMessageListResponse();
        getMessageListResponse.id = message.id;
        getMessageListResponse.name = message.name;
        getMessageListResponse.email = message.email;
        getMessageListResponse.message = message.message;
        getMessageListResponse.read = message.read;
        getMessageListResponse.createdAt = message.createdAt;
        return getMessageListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetAllMessagesQuery: ${JSON.stringify(
        getMessageListPaginatedResponse,
      )}`,
    ); */

    return getMessageListPaginatedResponse;
  }
}
