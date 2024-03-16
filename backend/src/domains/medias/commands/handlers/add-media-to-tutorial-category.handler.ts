import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../../../infrastructure/models/media.entity';
import { MediaUpdatedEvent } from '../../events/media-updated.event';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { AddMediaToTutorialCategoryCommand } from '../add-media-to-tutorial-category.command';
import { Logger } from '@nestjs/common';

@CommandHandler(AddMediaToTutorialCategoryCommand)
export class AddMediaToTutorialCategoryCommandHandler
  implements ICommandHandler<AddMediaToTutorialCategoryCommand>
{
  private readonly logger = new Logger(AddMediaToTutorialCategoryCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: AddMediaToTutorialCategoryCommand): Promise<boolean> {
    const { addMediaToTutorialCategoryRequest } = command;
    const { mediaId, categoryId } = addMediaToTutorialCategoryRequest;

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
      categoryId,
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
      `Successfully executed AddMediaToTutorialCategoryCommand: ${JSON.stringify(
        addMediaToTutorialCategoryRequest,
      )}`,
    ); */

    return true;
  }
}
