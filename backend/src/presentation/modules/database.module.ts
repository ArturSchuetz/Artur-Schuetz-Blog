import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV}` });

import { Media } from '../../infrastructure/models/media.entity';
import { BlogCategory } from '../../infrastructure/models/blog-category.entity';
import { BlogArticle } from '../../infrastructure/models/blog-article.entity';
import { TutorialCategory } from '../../infrastructure/models/tutorial-category.entity';
import { TutorialTopic } from '../../infrastructure/models/tutorial-topic.entity';
import { TutorialChapter } from '../../infrastructure/models/tutorial-chapter.entity';
import { TutorialArticle } from '../../infrastructure/models/tutorial-article.entity';
import { Message } from '../../infrastructure/models/message.entity';
import { PageView } from '../../infrastructure/models/page-view.entity';
import { Project } from '../../infrastructure/models/project.entity';
import { User } from '../../infrastructure/models/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Media, BlogCategory, BlogArticle, TutorialCategory, TutorialTopic, TutorialChapter, TutorialArticle, Message, PageView, Project, User],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([
      Media,
      BlogCategory,
      BlogArticle,
      TutorialCategory,
      TutorialTopic,
      TutorialChapter,
      TutorialArticle,
      Message,
      PageView,
      Project,
      User,
    ]),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
