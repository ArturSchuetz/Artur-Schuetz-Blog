import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../../../infrastructure/models/media.entity';
import { MediaUpdatedEvent } from '../../events/media-updated.event';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { AddMediaToTutorialArticleCommand } from '../add-media-to-tutorial-article.command';
import { Logger } from '@nestjs/common';

@CommandHandler(AddMediaToTutorialArticleCommand)
export class AddMediaToTutorialArticleCommandHandler
  implements ICommandHandler<AddMediaToTutorialArticleCommand>
{
  private readonly logger = new Logger(AddMediaToTutorialArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: AddMediaToTutorialArticleCommand): Promise<boolean> {
    const { addMediaToTutorialArticleRequest } = command;
    const { mediaId, articleId } = addMediaToTutorialArticleRequest;

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
      articleId,
      null,
    );

    const updatedMedia = await this.mediaRepository.save(media);
    const mediaModel = this.eventPublisher.mergeObjectContext(updatedMedia);
    mediaModel.apply(new MediaUpdatedEvent(mediaId));
    mediaModel.commit();

    /* this.logger.log(
      `Successfully executed AddMediaToTutorialArticleCommand: ${JSON.stringify(
        addMediaToTutorialArticleRequest,
      )}`,
    ); */

    return true;
  }
}
