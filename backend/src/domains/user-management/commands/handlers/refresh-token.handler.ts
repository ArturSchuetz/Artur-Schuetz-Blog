import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshTokenCommand } from '../refresh-token.command';
import { User } from 'src/infrastructure/models/user.entity';
import { UserAggregate } from '../../aggregates/user.aggregate';
import { RefreshTokenResponse } from '../../data-transfer-objects/refresh-token-response.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenCommandHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<RefreshTokenResponse> {
    const { refreshTokenRequest } = command;
    const { refreshToken } = refreshTokenRequest;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token must be provided');
    }

    let validatedToken;
    try {
      validatedToken = this.jwtService.verify(refreshToken);
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userRepository.findOne({
      where: { id: validatedToken.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Hier eventuell prüfen, ob das Refresh-Token in der Datenbank gespeichert und gültig ist

    const new_accessToken = await this.generateToken(user);
    const new_refreshToken = await this.generateRefreshToken(user);

    const refreshTokenResponse: RefreshTokenResponse = {
      accessToken: new_accessToken,
      refreshToken: new_refreshToken,
    };
    return refreshTokenResponse;
  }

  private async generateToken(user: User): Promise<string> {
    const payload = { userId: user.id, username: user.username };
    return this.jwtService.sign(payload);
  }

  private async generateRefreshToken(user: User): Promise<string> {
    const payload = { userId: user.id, username: user.username };
    return this.jwtService.sign(payload, { expiresIn: '7d' });
  }
}
