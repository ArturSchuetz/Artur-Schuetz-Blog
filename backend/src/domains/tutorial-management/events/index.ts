import { TutorialArticleCreatedHandler } from './handlers/article-created.handler';
import { TutorialArticleDeletedHandler } from './handlers/article-deleted.handler';
import { TutorialArticleUpdatedHandler } from './handlers/article-updated.handler';
import { TutorialCategoryCreatedHandler } from './handlers/category-created.handler';
import { TutorialCategoryDeletedHandler } from './handlers/category-deleted.handler';
import { TutorialCategoryUpdatedHandler } from './handlers/category-updated.handler';

export const TutorialEventHandlers = [
    TutorialArticleCreatedHandler,
    TutorialArticleDeletedHandler,
    TutorialArticleUpdatedHandler,
    TutorialCategoryCreatedHandler,
    TutorialCategoryDeletedHandler,
    TutorialCategoryUpdatedHandler,
];
