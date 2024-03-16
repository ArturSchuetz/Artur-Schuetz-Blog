import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

// Models
import { User } from '../../infrastructure/models/user.entity';

// Modules
import { DatabaseModule } from './database.module';
import { JwtAuthModule } from './jwt.module';

// Controllers
import { UsersController } from '../controllers/users.controller';
import { AuthController } from '../controllers/auth.controller';

// Handlers
import { UserCommandHandlers } from '../../domains/user-management/commands';
import { UserEventHandlers } from '../../domains/user-management/events';
import { UserQueryHandlers } from '../../domains/user-management/queries';

// Services
import { HelperService } from '../../application/services/helper.service';

@Module({
  imports: [
    CqrsModule,
    DatabaseModule,
    TypeOrmModule.forFeature([User]),
    JwtAuthModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    HelperService,
    ...UserCommandHandlers,
    ...UserEventHandlers,
    ...UserQueryHandlers,
  ],
})
export class UsersModule {}
