import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetMediaListResponse,
  GetMediaListPaginatedResponse,
} from '../../data-transfer-objects/get-media-list-response.dto';
import { GetAllMediasPaginatedQuery } from '../get-all-medias-paginated.query';
import { Media } from 'src/infrastructure/models/media.entity';

@QueryHandler(GetAllMediasPaginatedQuery)
export class GetAllMediasPaginatedHandler
  implements IQueryHandler<GetAllMediasPaginatedQuery>
{
  private readonly logger = new Logger(GetAllMediasPaginatedHandler.name);

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(
    query: GetAllMediasPaginatedQuery,
  ): Promise<GetMediaListPaginatedResponse> {
    /* this.logger.log(
      `Handling GetAllMediasPaginatedQuery: ${JSON.stringify(query)}`,
    ); */

    const { pageNumber = 1, pageSize = 10 } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let medias: Media[];
    let count: number;

    try {
      [medias, count] = await this.mediaRepository.findAndCount({
        skip: offset,
        take: pageSize,
      });
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getMediaListPaginatedResponse: GetMediaListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: medias.map((media) => {
        const getMediaListResponse = new GetMediaListResponse();
        getMediaListResponse.id = media.id;
        getMediaListResponse.filepath = media.filepath;
        getMediaListResponse.size = media.size;
        getMediaListResponse.type = media.type;
        getMediaListResponse.filename = media.filename;
        return getMediaListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetAllMediasQuery: ${JSON.stringify(
        getMediaListPaginatedResponse,
      )}`,
    ); */

    return getMediaListPaginatedResponse;
  }
}
