import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Models
import { Media } from '../../infrastructure/models/media.entity';

// Modules
import { DatabaseModule } from './database.module';

// Controllers
import { MediasController } from '../controllers/medias.controller';

// Handlers
import { MediaCommandHandlers } from '../../domains/medias/commands';
import { MediaEventHandlers } from '../../domains/medias/events';
import { MediaQueryHandlers } from '../../domains/medias/queries';

// Services
import { FileStorageService } from '../../application/services/file-storage.service';
import { HelperService } from '../../application/services/helper.service';

@Module({
  imports: [CqrsModule, DatabaseModule, TypeOrmModule.forFeature([Media])],
  controllers: [MediasController],
  providers: [
    HelperService,
    FileStorageService,
    ...MediaCommandHandlers,
    ...MediaEventHandlers,
    ...MediaQueryHandlers,
  ],
})
export class MediasModule {}
