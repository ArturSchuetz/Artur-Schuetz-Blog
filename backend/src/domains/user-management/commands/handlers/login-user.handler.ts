import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserCommand } from '../login-user.command';
import { User } from 'src/infrastructure/models/user.entity';
import { LoginUserResponse } from '../../data-transfer-objects/login-user-response.dto';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@CommandHandler(LoginUserCommand)
export class LoginUserCommandHandler
  implements ICommandHandler<LoginUserCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async execute(command: LoginUserCommand): Promise<LoginUserResponse> {
    const { loginUserRequest } = command;
    const { username, password } = loginUserRequest;

    const user = await this.userRepository.findOne({ where: { username } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Überprüfung des Passworts (angenommen, es gibt eine solche Funktion)
    const passwordIsValid = await this.verifyPassword(user, password);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password');
    }

    user.lastLogin = new Date();
    const updatedUser = await this.userRepository.save(user);

    // Generieren eines Tokens (angenommen, es gibt eine solche Funktion)
    const accessToken = await this.generateToken(updatedUser);
    const refreshToken = await this.generateRefreshToken(updatedUser);

    // Erfolgreiche Anmeldung, Rückgabe der Antwort
    const getUserResponse: LoginUserResponse = {
      accessToken,
      refreshToken,
    };

    return getUserResponse;
  }

  private async verifyPassword(user: User, password: string): Promise<boolean> {
    return user.password == password;
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
