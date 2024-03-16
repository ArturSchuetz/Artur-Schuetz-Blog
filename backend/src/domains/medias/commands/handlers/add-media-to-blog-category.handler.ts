import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../../../infrastructure/models/media.entity';
import { MediaUpdatedEvent } from '../../events/media-updated.event';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { AddMediaToBlogCategoryCommand } from '../add-media-to-blog-category.command';
import { Logger } from '@nestjs/common';

@CommandHandler(AddMediaToBlogCategoryCommand)
export class AddMediaToBlogCategoryCommandHandler
  implements ICommandHandler<AddMediaToBlogCategoryCommand>
{
  private readonly logger = new Logger(AddMediaToBlogCategoryCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: AddMediaToBlogCategoryCommand): Promise<boolean> {
    const { addMediaToCategoryRequest } = command;
    const { mediaId, categoryId } = addMediaToCategoryRequest;

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
      categoryId,
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
      `Successfully executed AddMediaToBlogCategoryCommand: ${JSON.stringify(
        addMediaToCategoryRequest,
      )}`,
    ); */

    return true;
  }
}
