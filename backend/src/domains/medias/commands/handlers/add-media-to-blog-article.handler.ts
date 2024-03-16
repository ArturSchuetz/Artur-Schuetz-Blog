import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../../../../infrastructure/models/media.entity';
import { MediaUpdatedEvent } from '../../events/media-updated.event';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { AddMediaToBlogArticleCommand } from '../add-media-to-blog-article.command';
import { Logger } from '@nestjs/common';

@CommandHandler(AddMediaToBlogArticleCommand)
export class AddMediaToBlogArticleCommandHandler
  implements ICommandHandler<AddMediaToBlogArticleCommand>
{
  private readonly logger = new Logger(AddMediaToBlogArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: AddMediaToBlogArticleCommand): Promise<boolean> {
    const { addMediaToArticleRequest } = command;
    const { mediaId, articleId } = addMediaToArticleRequest;

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
      articleId,
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
      `Successfully executed AddMediaToBlogArticleCommand: ${JSON.stringify(
        addMediaToArticleRequest,
      )}`,
    ); */

    return true;
  }
}
