import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Models
import { Media } from '../../infrastructure/models/media.entity';
import { BlogCategory } from '../../infrastructure/models/blog-category.entity';
import { Message } from '../../infrastructure/models/message.entity';

// Modules
import { DatabaseModule } from './database.module';

// Controllers
import { MessagesController } from '../controllers/messages.controller';
import { BlogCategoriesController } from '../controllers/blog-categories.controller';

// Handlers
import { MessageCommandHandlers } from '../../domains/message-management/commands';
import { MessageEventHandlers } from '../../domains/message-management/events';
import { MessageQueryHandlers } from '../../domains/message-management/queries';

// Services
import { HelperService } from '../../application/services/helper.service';

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    TypeOrmModule.forFeature([Media, BlogCategory, Message]),
  ],
  controllers: [MessagesController, BlogCategoriesController],
  providers: [
    HelperService,
    ...MessageCommandHandlers,
    ...MessageEventHandlers,
    ...MessageQueryHandlers,
  ],
})
export class MessagesModule {}
