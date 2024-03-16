import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../../../infrastructure/models/media.entity';
import { MediaUpdatedEvent } from '../../events/media-updated.event';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { AddMediaToUserCommand } from '../add-media-to-user.command';
import { Logger } from '@nestjs/common';

@CommandHandler(AddMediaToUserCommand)
export class AddMediaToUserCommandHandler
  implements ICommandHandler<AddMediaToUserCommand>
{
  private readonly logger = new Logger(AddMediaToUserCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: AddMediaToUserCommand): Promise<boolean> {
    const { addMediaToUserRequest } = command;
    const { mediaId, userId } = addMediaToUserRequest;

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
      null,
      null,
      null,
      userId,
    );

    const updatedMedia = await this.mediaRepository.save(media);
    const mediaModel = this.eventPublisher.mergeObjectContext(updatedMedia);
    mediaModel.apply(new MediaUpdatedEvent(mediaId));
    mediaModel.commit();

    /* this.logger.log(
      `Successfully executed AddMediaToUserCommand: ${JSON.stringify(
        addMediaToUserRequest,
      )}`,
    ); */

    return true;
  }
}
