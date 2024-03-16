import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMessageQuery } from '../get-message.query';
import { Message } from 'src/infrastructure/models/message.entity';
import { GetMessageResponse } from '../../data-transfer-objects/get-message-response.dto';

@QueryHandler(GetMessageQuery)
export class GetMessageHandler implements IQueryHandler<GetMessageQuery> {
  private readonly logger = new Logger(GetMessageHandler.name);

  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async execute(query: GetMessageQuery): Promise<GetMessageResponse> {
    /* this.logger.log(`Handling GetMessageQuery: ${JSON.stringify(query)}`); */

    const { messageId } = query;

    try {
      const message = await this.messageRepository.findOne({
        where: { id: messageId },
      });

      if (!message) {
        throw new NotFoundException('Message not found');
      }

      const getMessageResponse = {
        id: message.id,
        name: message.name,
        email: message.email,
        message: message.message,
        read: message.read,
        createdAt: message.createdAt,
      } as GetMessageResponse;

      /* this.logger.log(
        `Successfully executed GetMessageQuery: ${JSON.stringify(
          getMessageResponse,
        )}`,
      ); */

      return getMessageResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
