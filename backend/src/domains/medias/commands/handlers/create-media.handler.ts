import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMediaCommand } from '../create-media.command';
import { MediaCreatedEvent } from '../../events/media-created.event';
import { Media } from 'src/infrastructure/models/media.entity';
import { MediaAggregate } from '../../aggregates/media.aggregate';
import { FileStorageService } from '../../../../application/services/file-storage.service';
import { v4 as uuidv4 } from 'uuid';
import { Logger } from '@nestjs/common';

@CommandHandler(CreateMediaCommand)
export class CreateMediaCommandHandler
  implements ICommandHandler<CreateMediaCommand>
{
  private readonly logger = new Logger(CreateMediaCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly fileStorageService: FileStorageService,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  generateUniqueFilepath(filename: string): string {
    const fileExtension = filename.split('.').pop(); // Endung aus dem ursprünglichen Dateinamen extrahieren
    const uniqueId = uuidv4(); // Eine neue UUID generieren
    return `${uniqueId}.${fileExtension}`; // UUID und Dateiendung kombinieren
  }

  async execute(command: CreateMediaCommand): Promise<Media> {
    const { createMediaRequest } = command;
    const { buffer, size, type, filename } = createMediaRequest;

    const uniqueFilepath = this.generateUniqueFilepath(filename);
    const savedFilePath = await this.fileStorageService.saveFile(
      buffer,
      uniqueFilepath,
    );

    const newMedia = await MediaAggregate.create(
      0,
      savedFilePath,
      size,
      type,
      filename,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
      null,
    );

    const createdMedia = await this.mediaRepository.save(newMedia);
    const mediaModel = this.eventPublisher.mergeObjectContext(createdMedia);
    mediaModel.apply(new MediaCreatedEvent(newMedia.getId()));
    mediaModel.commit();

    /* this.logger.log(
      `Successfully executed CreateMediaCommand: ${JSON.stringify(mediaModel)}`,
    ); */

    return mediaModel;
  }
}
