import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetUserQuery } from '../get-user.query';
import { User } from 'src/infrastructure/models/user.entity';
import { GetUserResponse } from '../../data-transfer-objects/get-user-response.dto';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
  private readonly logger = new Logger(GetUserHandler.name);

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: GetUserQuery): Promise<GetUserResponse> {
    /* this.logger.log(`Handling GetUserQuery: ${JSON.stringify(query)}`); */

    const { userId } = query;

    try {
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['medias'],
      });

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const getUserResponse = {
        id: user.id,
        email: user.email,
        username: user.username,
        password: user.password,
        firstName: user.firstName,
        lastName: user.lastName,
        salt: user.salt,
        resetPasswordToken: user.resetPasswordToken,
        resetPasswordExpires: user.resetPasswordExpires,
        verificationToken: user.verificationToken,
        isVerified: user.isVerified,
        avatarImageId: user.avatarImageId,
        role: user.role,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        metadata: user.metadata,
        medias: user.medias,
      } as GetUserResponse;

      /* this.logger.log(
        `Successfully executed GetUserQuery: ${JSON.stringify(
          getUserResponse,
        )}`,
      ); */

      return getUserResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
