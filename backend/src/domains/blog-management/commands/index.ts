import { CreateBlogArticleCommandHandler } from './handlers/create-article.handler';
import { CreateBlogCategoryCommandHandler } from './handlers/create-category.handler';
import { DeleteBlogArticleCommandHandler } from './handlers/delete-article.handler';
import { DeleteBlogCategoryCommandHandler } from './handlers/delete-category.handler';
import { PublishBlogArticleCommandHandler } from './handlers/publish-article.handler';
import { UpdateBlogArticleCommandHandler } from './handlers/update-article.handler';
import { UpdateBlogCategoryCommandHandler } from './handlers/update-category.handler';

export const BlogArticleCommandHandlers = [
  CreateBlogArticleCommandHandler,
  CreateBlogCategoryCommandHandler,
  DeleteBlogArticleCommandHandler,
  DeleteBlogCategoryCommandHandler,
  PublishBlogArticleCommandHandler,
  UpdateBlogArticleCommandHandler,
  UpdateBlogCategoryCommandHandler,
];
