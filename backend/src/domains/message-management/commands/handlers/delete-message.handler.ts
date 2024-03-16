import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteMessageCommand } from '../delete-message.command';
import { MessageDeletedEvent } from '../../events/message-deleted.event';
import { Message } from 'src/infrastructure/models/message.entity';
import { MessageAggregate } from '../../aggregates/message.aggregate';
import { NotFoundException } from '@nestjs/common';

@CommandHandler(DeleteMessageCommand)
export class DeleteMessageCommandHandler
  implements ICommandHandler<DeleteMessageCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {}

  async execute(command: DeleteMessageCommand): Promise<boolean> {
    const { deleteMessageRequest } = command;
    const { id } = deleteMessageRequest;

    const toDelete = await this.messageRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      throw new NotFoundException('Message nicht gefunden');
    }

    const messageAggregate = await MessageAggregate.create(
      toDelete.id,
      toDelete.name,
      toDelete.email,
      toDelete.message,
      toDelete.read,
    );

    const deleteResult = await this.messageRepository.delete(
      messageAggregate.id,
    );
    const messageModel =
      this.eventPublisher.mergeObjectContext(messageAggregate);
    if (deleteResult.affected.valueOf() > 0) {
      messageModel.apply(new MessageDeletedEvent(messageModel.getId()));
    }
    messageModel.commit();

    return true;
  }
}
