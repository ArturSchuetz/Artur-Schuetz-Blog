import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserCommand } from '../update-user.command';
import { UserUpdatedEvent } from '../../events/user-updated.event';
import { UpdateUserResponse } from '../../data-transfer-objects/update-user-response.dto';
import { UserAggregate } from '../../aggregates/user.aggregate';
import { User } from '../../../../infrastructure/models/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler
  implements ICommandHandler<UpdateUserCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: UpdateUserCommand): Promise<UpdateUserResponse> {
    const { updateUserRequest } = command;
    const {
      id,
      email,
      username,
      password,
      firstName,
      lastName,
      salt,
      resetPasswordToken,
      resetPasswordExpires,
      verificationToken,
      isVerified,
      avatarImageId,
      role,
      isActive,
      lastLogin,
      metadata,
    } = updateUserRequest;

    const existingUser = await this.userRepository.findOne({
      where: { id },
      relations: ['medias'],
    });

    if (!existingUser) {
      throw new Error('User nicht gefunden');
    }

    const user = await UserAggregate.create(
      existingUser.id,
      email,
      username,
      password,
      firstName,
      lastName,
      salt,
      resetPasswordToken,
      resetPasswordExpires,
      verificationToken,
      isVerified,
      avatarImageId,
      role,
      isActive,
      lastLogin,
      metadata,
    );

    const updatedUser = await this.userRepository.save(user);

    const userModel = this.eventPublisher.mergeObjectContext(updatedUser);
    userModel.apply(new UserUpdatedEvent(id));
    userModel.commit();

    const updateUserResponse: UpdateUserResponse = {
      id: updatedUser.id,
      email: updatedUser.email,
      username: updatedUser.username,
      password: updatedUser.password,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      salt: updatedUser.salt,
      resetPasswordToken: updatedUser.resetPasswordToken,
      resetPasswordExpires: updatedUser.resetPasswordExpires,
      verificationToken: updatedUser.verificationToken,
      isVerified: updatedUser.isVerified,
      avatarImageId: updatedUser.avatarImageId,
      role: updatedUser.role,
      isActive: updatedUser.isActive,
      lastLogin: updatedUser.lastLogin,
      metadata: updatedUser.metadata,
      medias: existingUser.medias,
    };

    return updateUserResponse;
  }
}
