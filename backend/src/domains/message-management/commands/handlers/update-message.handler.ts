import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateMessageCommand } from '../update-message.command';
import { MessageUpdatedEvent } from '../../events/message-updated.event';
import { Message } from 'src/infrastructure/models/message.entity';
import { UpdateMessageResponse } from '../../data-transfer-objects/update-message-response.dto';
import { MessageAggregate } from '../../aggregates/message.aggregate';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(UpdateMessageCommand)
export class UpdateMessageCommandHandler
  implements ICommandHandler<UpdateMessageCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async execute(command: UpdateMessageCommand): Promise<UpdateMessageResponse> {
    const { updateMessageRequest } = command;
    const { id, name, email, message, read } = updateMessageRequest;

    const existingMessage = await this.messageRepository.findOne({
      where: { id },
    });

    if (!existingMessage) {
      throw new NotFoundException('Message not found');
    }

    const messageAggregate = await MessageAggregate.create(
      existingMessage.id,
      name,
      email,
      message,
      read,
    );

    const updatedMessage = await this.messageRepository.save(messageAggregate);

    const messageModel = this.eventPublisher.mergeObjectContext(updatedMessage);
    messageModel.apply(new MessageUpdatedEvent(id));
    messageModel.commit();

    const updateMessageResponse: UpdateMessageResponse = {
      id: updatedMessage.id,
      name: updatedMessage.name,
      email: updatedMessage.email,
      message: updatedMessage.message,
      read: updatedMessage.read,
    };

    return updateMessageResponse;
  }
}
