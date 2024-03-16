import { MediaCreatedHandler } from './handlers/media-created.handler';
import { MediaDeletedHandler } from './handlers/media-deleted.handler';
import { MediaUpdatedHandler } from './handlers/media-updated.handler';

export const MediaEventHandlers = [
  MediaCreatedHandler,
  MediaDeletedHandler,
  MediaUpdatedHandler,
];
