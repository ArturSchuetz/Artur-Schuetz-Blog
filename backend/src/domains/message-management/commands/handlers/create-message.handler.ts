import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageCommand } from '../create-message.command';
import { MessageCreatedEvent } from '../../events/message-created.event';
import { Message } from 'src/infrastructure/models/message.entity';
import { MessageAggregate } from '../../aggregates/message.aggregate';

@CommandHandler(CreateMessageCommand)
export class CreateMessageCommandHandler
  implements ICommandHandler<CreateMessageCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async execute(command: CreateMessageCommand): Promise<Message> {
    const { createMessageRequest } = command;
    const { name, email, message } = createMessageRequest;

    const messageAggregate = await MessageAggregate.create(
      0,
      name,
      email,
      message,
      false,
    );

    const createdMessage = await this.messageRepository.save(messageAggregate);
    const messageModel = this.eventPublisher.mergeObjectContext(createdMessage);
    messageModel.apply(new MessageCreatedEvent(messageAggregate.getId()));
    messageModel.commit();

    return messageModel;
  }
}
