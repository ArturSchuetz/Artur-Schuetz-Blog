import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { DeleteTutorialTopicCommand } from '../delete-topic.command';
import { TutorialTopicDeletedEvent } from '../../events/topic-deleted.event';
import { TutorialTopic } from 'src/infrastructure/models/tutorial-topic.entity';
import { TutorialTopicAggregate } from '../../aggregates/tutorial-topic.aggregate';

@CommandHandler(DeleteTutorialTopicCommand)
export class DeleteTutorialTopicCommandHandler
  implements ICommandHandler<DeleteTutorialTopicCommand>
{
  private readonly logger = new Logger(DeleteTutorialTopicCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(TutorialTopic)
    private readonly topicRepository: Repository<TutorialTopic>,
  ) {}

  async execute(command: DeleteTutorialTopicCommand): Promise<boolean> {
    const { deleteTopicRequest } = command;
    const { id } = deleteTopicRequest;

    const toDelete = await this.topicRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      return false;
    }

    const topic = await TutorialTopicAggregate.create(
      toDelete.id,
      toDelete.position,
      toDelete.name,
      toDelete.slug,
      toDelete.description,
      toDelete.color,
      toDelete.imageId,
      toDelete.categoryId,
    );

    const deleteResult = await this.topicRepository.delete(topic.id);
    const topicModel = this.eventPublisher.mergeObjectContext(topic);
    if (deleteResult.affected.valueOf() > 0) {
      topicModel.apply(new TutorialTopicDeletedEvent(topicModel.getId()));
    }
    topicModel.commit();

    /* this.logger.log(
      `Successfully executed DeleteTutorialTopicCommand: ${JSON.stringify(
        deleteTopicRequest,
      )}`,
    ); */

    return true;
  }
}
