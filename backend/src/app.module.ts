import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

// Modules
import { MediasModule } from './presentation/modules/medias.module';
import { ProjectsModule } from './presentation/modules/projects.module';
import { DatabaseModule } from './presentation/modules/database.module';
import { ArticlesModule } from './presentation/modules/articles.module';
import { TutorialsModule } from './presentation/modules/tutorials.module';
import { MessagesModule } from './presentation/modules/messages.module';
import { UsersModule } from './presentation/modules/users.module';
import { JwtAuthModule } from './presentation/modules/jwt.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    MediasModule,
    ProjectsModule,
    ArticlesModule,
    TutorialsModule,
    MessagesModule,
    UsersModule,
    JwtAuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply((req, res, next) => {
        if (req.method === 'OPTIONS') {
          res.status(204).end();
        } else {
          next();
        }
      })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
