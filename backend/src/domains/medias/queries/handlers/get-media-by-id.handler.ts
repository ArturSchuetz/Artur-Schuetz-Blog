import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetMediaByIdQuery } from '../get-media-by-id.query';
import { Media } from 'src/infrastructure/models/media.entity';
import { GetMediaResponse } from '../../data-transfer-objects/get-media-response.dto';

@QueryHandler(GetMediaByIdQuery)
export class GetMediaHandler implements IQueryHandler<GetMediaByIdQuery> {
  private readonly logger = new Logger(GetMediaHandler.name);

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(query: GetMediaByIdQuery): Promise<GetMediaResponse> {
    /* this.logger.log(`Handling GetMediaByIdQuery: ${JSON.stringify(query)}`); */

    const { mediaId } = query;

    try {
      const media = await this.mediaRepository.findOne({
        where: { id: mediaId },
      });

      if (!media) {
        throw new NotFoundException('Media not found');
      }

      const getMediaResponse = {
        id: media.id,
        filepath: media.filepath,
        size: media.size,
        type: media.type,
        filename: media.filename,
      } as GetMediaResponse;

      /* this.logger.log(
        `Successfully executed GetMediaByIdQuery: ${JSON.stringify(
          getMediaResponse,
        )}`,
      ); */

      return getMediaResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
