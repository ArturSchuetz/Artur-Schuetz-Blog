import { CreateTutorialArticleCommandHandler } from './handlers/create-article.handler';
import { CreateTutorialCategoryCommandHandler } from './handlers/create-category.handler';
import { CreateTutorialChapterCommandHandler } from './handlers/create-chapter.handler';
import { CreateTutorialTopicCommandHandler } from './handlers/create-topic.handler';
import { DeleteTutorialArticleCommandHandler } from './handlers/delete-article.handler';
import { DeleteTutorialCategoryCommandHandler } from './handlers/delete-category.handler';
import { DeleteTutorialChapterCommandHandler } from './handlers/delete-chapter.handler';
import { DeleteTutorialTopicCommandHandler } from './handlers/delete-topic.handler';
import { PublishTutorialArticleCommandHandler } from './handlers/publish-article.handler';
import { UpdateTutorialArticleCommandHandler } from './handlers/update-article.handler';
import { UpdateTutorialCategoryCommandHandler } from './handlers/update-category.handler';
import { UpdateTutorialChapterCommandHandler } from './handlers/update-chapter.handler';
import { UpdateTutorialTopicCommandHandler } from './handlers/update-topic.handler';

export const TutorialCommandHandlers = [
    CreateTutorialArticleCommandHandler,
    CreateTutorialCategoryCommandHandler,
    CreateTutorialChapterCommandHandler,
    CreateTutorialTopicCommandHandler,
    DeleteTutorialArticleCommandHandler,
    DeleteTutorialCategoryCommandHandler,
    DeleteTutorialChapterCommandHandler,
    DeleteTutorialTopicCommandHandler,
    PublishTutorialArticleCommandHandler,
    UpdateTutorialArticleCommandHandler,
    UpdateTutorialCategoryCommandHandler,
    UpdateTutorialChapterCommandHandler,
    UpdateTutorialTopicCommandHandler,
];
