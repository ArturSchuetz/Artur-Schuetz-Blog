import { GetAllBlogArticlesHandler } from './handlers/get-all-articles.handler';
import { GetAllBlogCategoriesHandler } from './handlers/get-all-categories.handler';
import { GetBlogArticleMetaHandler } from './handlers/get-article-meta.handler';
import { GetBlogArticleViewsOverviewQueryHandler } from './handlers/get-article-views-overview.handler';
import { GetBlogArticleHandler } from './handlers/get-article.handler';
import { GetBlogArticlesByCategoryHandler } from './handlers/get-articles-by-category.handler';
import { GetBlogCategoryHandler } from './handlers/get-category.handler';

export const BlogArticleQueryHandlers = [
  GetAllBlogArticlesHandler,
  GetAllBlogCategoriesHandler,
  GetBlogArticleMetaHandler,
  GetBlogArticleViewsOverviewQueryHandler,
  GetBlogArticleHandler,
  GetBlogArticlesByCategoryHandler,
  GetBlogCategoryHandler,
];
