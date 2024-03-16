import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

// Models
import { Media } from '../../infrastructure/models/media.entity';
import { TutorialArticle } from '../../infrastructure/models/tutorial-article.entity';
import { TutorialCategory } from '../../infrastructure/models/tutorial-category.entity';
import { TutorialChapter } from '../../infrastructure/models/tutorial-chapter.entity';
import { TutorialTopic } from '../../infrastructure/models/tutorial-topic.entity';
import { PageView } from '../../infrastructure/models/page-view.entity';

// Modules
import { DatabaseModule } from './database.module';

// Controllers
import { TutorialArticlesController } from '../controllers/tutorial-articles.controller';
import { TutorialCategoriesController } from '../controllers/tutorial-categories.controller';
import { TutorialChaptersController } from '../controllers/tutorial-chapters.controller';
import { TutorialTopicsController } from '../controllers/tutorial-topics.controller';

// Handlers
import { TutorialCommandHandlers } from '../../domains/tutorial-management/commands';
import { TutorialEventHandlers } from '../../domains/tutorial-management/events';
import { TutorialQueryHandlers } from '../../domains/tutorial-management/queries';

// Services
import { HelperService } from '../../application/services/helper.service';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Media, TutorialTopic, TutorialCategory, TutorialChapter, TutorialArticle, PageView]),
  ],
  controllers: [TutorialArticlesController, TutorialCategoriesController, TutorialChaptersController, TutorialTopicsController],
  providers: [
    HelperService,
    ...TutorialCommandHandlers,
    ...TutorialEventHandlers,
    ...TutorialQueryHandlers,
  ],
})
export class TutorialsModule {}
