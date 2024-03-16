import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from 'src/infrastructure/models/message.entity';
import { MessageAggregate } from '../../aggregates/message.aggregate';
import { MarkAsReadCommand } from '../mark-message-as-read.command';
import { UpdateMessageResponse } from '../../data-transfer-objects/update-message-response.dto';
import { MessageUpdatedEvent } from '../../events/message-updated.event';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(MarkAsReadCommand)
export class MarkAsReadCommandCommandHandler
  implements ICommandHandler<MarkAsReadCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async execute(command: MarkAsReadCommand): Promise<UpdateMessageResponse> {
    const { markAsReadRequest } = command;
    const { id } = markAsReadRequest;

    const toMark = await this.messageRepository.findOne({
      where: { id: id },
    });

    if (!toMark) {
      throw new NotFoundException('Message not found');
    }

    const messageAggregate = await MessageAggregate.create(
      toMark.id,
      toMark.name,
      toMark.email,
      toMark.message,
      true,
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
