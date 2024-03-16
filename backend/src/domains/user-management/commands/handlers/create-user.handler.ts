import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserCommand } from '../create-user.command';
import { UserCreatedEvent } from '../../events/user-created.event';
import { User } from 'src/infrastructure/models/user.entity';
import { UserAggregate } from '../../aggregates/user.aggregate';
import { CreateUserResponse } from '../../data-transfer-objects/create-user-response.dto';
import { BadRequestException } from '@nestjs/common';

@CommandHandler(CreateUserCommand)
export class CreateUserCommandHandler
  implements ICommandHandler<CreateUserCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(command: CreateUserCommand): Promise<CreateUserResponse> {
    const { createUserRequest } = command;
    const { email, username, password } = createUserRequest;

    if (!email || !username || !password) {
      throw new BadRequestException('Required fields are missing');
    }

    const existingEmail = await this.userRepository.findOne({
      where: { email },
    });
    if (existingEmail) {
      throw new BadRequestException('Email already in use');
    }

    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const user = await UserAggregate.createWithRequiredFields(
      email,
      username,
      password,
    );

    const createdUser = await this.userRepository.save(user);
    const userModel = this.eventPublisher.mergeObjectContext(createdUser);
    userModel.apply(new UserCreatedEvent(user.getId()));
    userModel.commit();

    const getUserResponse: CreateUserResponse = {};
    return getUserResponse;
  }
}
