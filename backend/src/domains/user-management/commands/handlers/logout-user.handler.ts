import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LogoutUserCommand } from '../logout-user.command';
import { UserLoggedOutEvent } from '../../events/user-logged-out.event';
import { User } from 'src/infrastructure/models/user.entity';
import { UserAggregate } from '../../aggregates/user.aggregate';
import { LogoutUserResponse } from '../../data-transfer-objects/logout-user-response.dto';

@CommandHandler(LogoutUserCommand)
export class LogoutUserCommandHandler
  implements ICommandHandler<LogoutUserCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: LogoutUserCommand): Promise<LogoutUserResponse> {
    const { logoutUserRequest } = command;
    const { userId } = logoutUserRequest;

    const getUserResponse: LogoutUserResponse = {
      success: true,
      message: 'User logged out successfully',
    };

    return getUserResponse;
  }
}
