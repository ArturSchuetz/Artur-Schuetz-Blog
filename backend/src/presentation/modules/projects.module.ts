import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Models
import { Project } from '../../infrastructure/models/project.entity';

// Modules
import { DatabaseModule } from './database.module';

// Controllers
import { ProjectsController } from './../../presentation/controllers/projects.controller';

// Handlers
import { ProjectCommandHandlers } from './../../domains/portfolio-projects/commands';
import { ProjectEventHandlers } from './../../domains/portfolio-projects/events';
import { ProjectQueryHandlers } from './../../domains/portfolio-projects/queries';

// Services
import { HelperService } from '../../application/services/helper.service';

@Module({
  imports: [CqrsModule, DatabaseModule, TypeOrmModule.forFeature([Project])],
  controllers: [ProjectsController],
  providers: [
    HelperService,
    ...ProjectCommandHandlers,
    ...ProjectEventHandlers,
    ...ProjectQueryHandlers,
  ],
})
export class ProjectsModule {}
