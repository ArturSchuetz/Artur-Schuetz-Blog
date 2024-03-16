import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetMediaListResponse,
  GetMediaListPaginatedResponse,
} from '../../data-transfer-objects/get-media-list-response.dto';
import { GetAllMediasQuery } from '../get-all-medias.query';
import { Media } from 'src/infrastructure/models/media.entity';

@QueryHandler(GetAllMediasQuery)
export class GetAllMediasHandler implements IQueryHandler<GetAllMediasQuery> {
  private readonly logger = new Logger(GetAllMediasHandler.name);

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(query: GetAllMediasQuery): Promise<GetMediaListResponse[]> {
    /* this.logger.log(`Handling GetAllMediasQuery: ${JSON.stringify(query)}`); */

    let medias: Media[];
    let count: number;

    try {
      [medias, count] = await this.mediaRepository.findAndCount();
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getMediaListResponse: GetMediaListResponse[] = medias.map((media) => {
      const getMediaListResponse = new GetMediaListResponse();
      getMediaListResponse.id = media.id;
      getMediaListResponse.filepath = media.filepath;
      getMediaListResponse.size = media.size;
      getMediaListResponse.type = media.type;
      getMediaListResponse.filename = media.filename;
      return getMediaListResponse;
    });

    /* this.logger.log(
      `Successfully executed GetAllMediasQuery: ${JSON.stringify(
        getMediaListResponse.length,
      )}`,
    ); */

    return getMediaListResponse;
  }
}
