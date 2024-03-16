import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Models
import { Media } from '../../infrastructure/models/media.entity';
import { BlogCategory } from '../../infrastructure/models/blog-category.entity';
import { BlogArticle } from '../../infrastructure/models/blog-article.entity';
import { PageView } from '../../infrastructure/models/page-view.entity';

// Modules
import { DatabaseModule } from './database.module';

// Controllers
import { BlogArticlesController } from '../controllers/blog-articles.controller';
import { BlogCategoriesController } from '../controllers/blog-categories.controller';

// Handlers
import { BlogArticleCommandHandlers } from '../../domains/blog-management/commands';
import { BlogArticleEventHandlers } from '../../domains/blog-management/events';
import { BlogArticleQueryHandlers } from '../../domains/blog-management/queries';

// Services
import { HelperService } from '../../application/services/helper.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Media, BlogCategory, BlogArticle, PageView]),
  ],
  controllers: [BlogArticlesController, BlogCategoriesController],
  providers: [
    HelperService,
    ...BlogArticleCommandHandlers,
    ...BlogArticleEventHandlers,
    ...BlogArticleQueryHandlers,
  ],
})
export class ArticlesModule {}
