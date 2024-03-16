import { AddMediaToBlogArticleCommandHandler } from './handlers/add-media-to-blog-article.handler';
import { AddMediaToBlogCategoryCommandHandler } from './handlers/add-media-to-blog-category.handler';
import { AddMediaToTutorialArticleCommandHandler } from './handlers/add-media-to-tutorial-article.handler';
import { AddMediaToTutorialCategoryCommandHandler } from './handlers/add-media-to-tutorial-category.handler';
import { AddMediaToTutorialChapterCommandHandler } from './handlers/add-media-to-tutorial-chapter.handler';
import { AddMediaToTutorialTopicCommandHandler } from './handlers/add-media-to-tutorial-topic.handler';
import { AddMediaToProjectCommandHandler } from './handlers/add-media-to-project.handler';
import { AddMediaToUserCommandHandler } from './handlers/add-media-to-user.handler';
import { CreateMediaCommandHandler } from './handlers/create-media.handler';
import { DeleteMediaCommandHandler } from './handlers/delete-media.handler';

export const MediaCommandHandlers = [
  AddMediaToBlogArticleCommandHandler,
  AddMediaToBlogCategoryCommandHandler,
  AddMediaToTutorialArticleCommandHandler,
  AddMediaToTutorialCategoryCommandHandler,
  AddMediaToTutorialChapterCommandHandler,
  AddMediaToTutorialTopicCommandHandler,
  AddMediaToProjectCommandHandler,
  AddMediaToUserCommandHandler,
  CreateMediaCommandHandler,
  DeleteMediaCommandHandler,
];
