import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../../../infrastructure/models/media.entity';
import { MediaUpdatedEvent } from '../../events/media-updated.event';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { AddMediaToTutorialChapterCommand } from '../add-media-to-tutorial-chapter.command';
import { Logger } from '@nestjs/common';

@CommandHandler(AddMediaToTutorialChapterCommand)
export class AddMediaToTutorialChapterCommandHandler
  implements ICommandHandler<AddMediaToTutorialChapterCommand>
{
  private readonly logger = new Logger(AddMediaToTutorialChapterCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: AddMediaToTutorialChapterCommand): Promise<boolean> {
    const { addMediaToTutorialChapterRequest } = command;
    const { mediaId, chapterId } = addMediaToTutorialChapterRequest;

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
      chapterId,
      null,
      null,
    );

    const updatedMedia = await this.mediaRepository.save(media);
    const mediaModel = this.eventPublisher.mergeObjectContext(updatedMedia);
    mediaModel.apply(new MediaUpdatedEvent(mediaId));
    mediaModel.commit();

    /* this.logger.log(
      `Successfully executed AddMediaToTutorialChapterCommand: ${JSON.stringify(
        addMediaToTutorialChapterRequest,
      )}`,
    ); */

    return true;
  }
}
