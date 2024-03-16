import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteUserCommand } from '../delete-user.command';
import { UserDeletedEvent } from '../../events/user-deleted.event';
import { User } from 'src/infrastructure/models/user.entity';
import { UserAggregate } from '../../aggregates/user.aggregate';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
  implements ICommandHandler<DeleteUserCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: DeleteUserCommand): Promise<boolean> {
    const { deleteUserRequest } = command;
    const { id } = deleteUserRequest;

    const toDelete = await this.userRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      return false;
    }

    const user = await UserAggregate.create(
      toDelete.id,
      toDelete.email,
      toDelete.username,
      toDelete.password,
      toDelete.firstName,
      toDelete.lastName,
      toDelete.salt,
      toDelete.resetPasswordToken,
      toDelete.resetPasswordExpires,
      toDelete.verificationToken,
      toDelete.isVerified,
      toDelete.avatarImageId,
      toDelete.role,
      toDelete.isActive,
      toDelete.lastLogin,
      toDelete.metadata,
    );

    const deleteResult = await this.userRepository.delete(user.id);
    const userModel = this.eventPublisher.mergeObjectContext(user);
    userModel.apply(new UserDeletedEvent(deleteResult.affected.valueOf()));
    userModel.commit();

    return true;
  }
}
