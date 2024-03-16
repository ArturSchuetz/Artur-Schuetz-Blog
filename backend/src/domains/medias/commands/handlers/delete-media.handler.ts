import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteMediaCommand } from '../delete-media.command';
import { MediaDeletedEvent } from '../../events/media-deleted.event';
import { Media } from 'src/infrastructure/models/media.entity';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { Logger } from '@nestjs/common';
import * as fs from 'fs/promises';

@CommandHandler(DeleteMediaCommand)
export class DeleteMediaCommandHandler
  implements ICommandHandler<DeleteMediaCommand>
{
  private readonly logger = new Logger(DeleteMediaCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: DeleteMediaCommand): Promise<boolean> {
    const { deleteMediaRequest } = command;
    const { id } = deleteMediaRequest;

    const toDelete = await this.mediaRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      return false;
    }

    const media = await MediaAggregate.create(
      toDelete.id,
      toDelete.filepath,
      toDelete.size,
      toDelete.type,
      toDelete.filename,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );

    try {
      await fs.unlink(toDelete.filepath);

      const deleteResult = await this.mediaRepository.delete(media.id);
      const mediaModel = this.eventPublisher.mergeObjectContext(media);
      mediaModel.apply(new MediaDeletedEvent(deleteResult.affected.valueOf()));
      mediaModel.commit();

      /* this.logger.log(
        `Successfully executed DeleteMediaCommand: ${JSON.stringify(
          deleteMediaRequest,
        )}`,
      ); */
    } catch (err) {
      this.logger.error(
        `Failed to delete file at ${toDelete.filepath}: ${err.message}`,
      );
      throw new Error('Failed to delete file');
    }

    return true;
  }
}
