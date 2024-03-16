import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { HelperService } from 'src/application/services/helper.service';

import { UpdateTutorialTopicCommand } from '../update-topic.command';
import { TutorialTopicUpdatedEvent } from '../../events/topic-updated.event';
import { TutorialTopic } from 'src/infrastructure/models/tutorial-topic.entity';
import { UpdateTutorialTopicResponse } from '../../data-transfer-objects/update-topic-response.dto';
import { TutorialTopicAggregate } from '../../aggregates/tutorial-topic.aggregate';

@CommandHandler(UpdateTutorialTopicCommand)
export class UpdateTutorialTopicCommandHandler
  implements ICommandHandler<UpdateTutorialTopicCommand>
{
  private readonly logger = new Logger(UpdateTutorialTopicCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(TutorialTopic)
    private readonly topicRepository: Repository<TutorialTopic>,
  ) {}

  async execute(
    command: UpdateTutorialTopicCommand,
  ): Promise<UpdateTutorialTopicResponse> {
    const { updateTutorialTopicRequest } = command;
    const { id, position, name, description, color, imageId, categoryId } = updateTutorialTopicRequest;

    const existingTopic = await this.topicRepository.findOne({
      where: { id },
      relations: ['medias'],
    });

    if (!existingTopic) {
      throw new Error('Projekt nicht gefunden');
    }

    const topic = await TutorialTopicAggregate.create(
      existingTopic.id,
      position,
      name,
      this.helperService.createSlug(name),
      description,
      color,
      imageId,
      categoryId
    );

    const updatedTopic = await this.topicRepository.save(topic);

    const topicModel =
      this.eventPublisher.mergeObjectContext(updatedTopic);
    topicModel.apply(new TutorialTopicUpdatedEvent(id));
    topicModel.commit();

    const updateTopicResponse: UpdateTutorialTopicResponse = {
      id: updatedTopic.id,
      position: updatedTopic.position,
      name: updatedTopic.name,
      slug: updatedTopic.slug,
      description: updatedTopic.description,
      color: updatedTopic.color,
      imageId: updatedTopic.imageId,
      categoryId: updatedTopic.categoryId,
      medias: existingTopic.medias,
    };

    /* this.logger.log(
      `Successfully executed UpdateTutorialTopicCommand: ${JSON.stringify(
        updateTopicResponse,
      )}`,
    ); */

    return updateTopicResponse;
  }
}
