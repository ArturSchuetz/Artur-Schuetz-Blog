import { GetAllMediasPaginatedHandler } from './handlers/get-all-medias-paginated.handler';
import { GetAllMediasHandler } from './handlers/get-all-medias.handler';
import { GetMediaHandler } from './handlers/get-media-by-id.handler';

export const MediaQueryHandlers = [
  GetAllMediasPaginatedHandler,
  GetAllMediasHandler,
  GetMediaHandler,
];
