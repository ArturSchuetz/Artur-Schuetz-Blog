import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../../../infrastructure/models/media.entity';
import { MediaUpdatedEvent } from '../../events/media-updated.event';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { AddMediaToProjectCommand } from '../add-media-to-project.command';
import { Logger } from '@nestjs/common';

@CommandHandler(AddMediaToProjectCommand)
export class AddMediaToProjectCommandHandler
  implements ICommandHandler<AddMediaToProjectCommand>
{
  private readonly logger = new Logger(AddMediaToProjectCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: AddMediaToProjectCommand): Promise<boolean> {
    const { addMediaToProjectRequest } = command;
    const { mediaId, projectId } = addMediaToProjectRequest;

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
      projectId,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );

    const updatedMedia = await this.mediaRepository.save(media);
    const mediaModel = this.eventPublisher.mergeObjectContext(updatedMedia);
    mediaModel.apply(new MediaUpdatedEvent(mediaId));
    mediaModel.commit();

    /* this.logger.log(
      `Successfully executed AddMediaToProjectCommand: ${JSON.stringify(
        addMediaToProjectRequest,
      )}`,
    ); */

    return true;
  }
}
