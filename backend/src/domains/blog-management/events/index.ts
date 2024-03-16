import { BlogArticleCreatedHandler } from './handlers/article-created.handler';
import { BlogArticleDeletedHandler } from './handlers/article-deleted.handler';
import { BlogArticleUpdatedHandler } from './handlers/article-updated.handler';
import { BlogCategoryCreatedHandler } from './handlers/category-created.handler';
import { BlogCategoryDeletedHandler } from './handlers/category-deleted.handler';
import { BlogCategoryUpdatedHandler } from './handlers/category-updated.handler';

export const BlogArticleEventHandlers = [
  BlogArticleCreatedHandler,
  BlogArticleDeletedHandler,
  BlogArticleUpdatedHandler,
  BlogCategoryCreatedHandler,
  BlogCategoryDeletedHandler,
  BlogCategoryUpdatedHandler,
];
