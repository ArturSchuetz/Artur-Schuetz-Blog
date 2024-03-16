import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { HelperService } from 'src/application/services/helper.service';

import { CreateTutorialTopicCommand } from '../create-topic.command';
import { TutorialTopic } from 'src/infrastructure/models/tutorial-topic.entity';
import { TutorialTopicCreatedEvent } from '../../events/topic-created.event';
import { TutorialTopicAggregate } from '../../aggregates/tutorial-topic.aggregate';

@CommandHandler(CreateTutorialTopicCommand)
export class CreateTutorialTopicCommandHandler
  implements ICommandHandler<CreateTutorialTopicCommand>
{
  private readonly logger = new Logger(CreateTutorialTopicCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(TutorialTopic)
    private readonly topicRepository: Repository<TutorialTopic>,
  ) {}

  async execute(command: CreateTutorialTopicCommand): Promise<TutorialTopic> {
    const { createTutorialTopicRequest } = command;
    const { position, name, description, color } = createTutorialTopicRequest;
    const topic = await TutorialTopicAggregate.create(0, position, name, this.helperService.createSlug(name), description, color, null, null);

    const createTopic = await this.topicRepository.save(topic);
    const topicModel =
      this.eventPublisher.mergeObjectContext(createTopic);
    topicModel.apply(new TutorialTopicCreatedEvent(topic.getId()));
    topicModel.commit();

    /* this.logger.log(
      `Successfully executed CreateTutorialTopicCommand: ${JSON.stringify(
        topicModel,
      )}`,
    ); */

    return topicModel;
  }

}
