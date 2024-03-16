import { GetAllTutorialArticlesHandler } from './handlers/get-all-articles.handler';
import { GetAllTutorialCategoriesHandler } from './handlers/get-all-categories.handler';
import { GetAllTutorialCategoryTopicsHandler } from './handlers/get-all-category-topics.handler';
import { GetAllTutorialChaptersHandler } from './handlers/get-all-chapters.handler';
import { GetAllTutorialTopicsHandler } from './handlers/get-all-topics.handler';
import { GetTutorialArticleMetaHandler } from './handlers/get-article-meta.handler';
import { GetTutorialArticleViewsOverviewQueryHandler } from './handlers/get-article-views-overview.handler';
import { GetTutorialArticleHandler } from './handlers/get-article.handler';
import { GetTutorialArticlesByChapterHandler } from './handlers/get-articles-by-chapter.handler';
import { GetTutorialCategoryHandler } from './handlers/get-category.handler';
import { GetTutorialChapterHandler } from './handlers/get-chapter.handler';
import { GetTutorialChaptersByTopicHandler } from './handlers/get-chapters-by-topic.handler';
import { GetTutorialTopicHandler } from './handlers/get-topic.handler';

export const TutorialQueryHandlers = [
  GetAllTutorialArticlesHandler,
  GetAllTutorialCategoriesHandler,
  GetAllTutorialCategoryTopicsHandler,
  GetAllTutorialChaptersHandler,
  GetAllTutorialTopicsHandler,
  GetTutorialArticleMetaHandler,
  GetTutorialArticleViewsOverviewQueryHandler,
  GetTutorialArticleHandler,
  GetTutorialArticlesByChapterHandler,
  GetTutorialCategoryHandler,
  GetTutorialChapterHandler,
  GetTutorialChaptersByTopicHandler,
  GetTutorialTopicHandler,
];
