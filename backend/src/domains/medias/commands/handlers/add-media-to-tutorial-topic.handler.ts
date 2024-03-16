import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../../../infrastructure/models/media.entity';
import { MediaUpdatedEvent } from '../../events/media-updated.event';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { AddMediaToTutorialTopicCommand } from '../add-media-to-tutorial-topic.command';
import { Logger } from '@nestjs/common';

@CommandHandler(AddMediaToTutorialTopicCommand)
export class AddMediaToTutorialTopicCommandHandler
  implements ICommandHandler<AddMediaToTutorialTopicCommand>
{
  private readonly logger = new Logger(AddMediaToTutorialTopicCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: AddMediaToTutorialTopicCommand): Promise<boolean> {
    const { addMediaToTutorialTopicRequest } = command;
    const { mediaId, topicId } = addMediaToTutorialTopicRequest;

    const toModify = await this.mediaRepository.findOne({
      where: { id: mediaId },
    });

    if (!toModify) {
      return false;
    }

    const media = await MediaAggregate.create(
      toModify.id,
      toModify.filepath,
      toModify.size,
      toModify.type,
      toModify.filename,
      null,
      null,
      null,
      null,
      topicId,
      null,
      null,
      null,
    );

    const updatedMedia = await this.mediaRepository.save(media);
    const mediaModel = this.eventPublisher.mergeObjectContext(updatedMedia);
    mediaModel.apply(new MediaUpdatedEvent(mediaId));
    mediaModel.commit();

    /* this.logger.log(
      `Successfully executed AddMediaToTutorialTopicCommand: ${JSON.stringify(
        addMediaToTutorialTopicRequest,
      )}`,
    ); */

    return true;
  }
}
