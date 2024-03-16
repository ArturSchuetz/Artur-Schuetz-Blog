import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, User } from 'src/infrastructure/models/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('SECRET_KEY'),
    });
  }

  async validate(payload: any): Promise<User> {
    const { userId, username } = payload;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (
      !user ||
      user.username !== username ||
      !user.isActive ||
      !user.isVerified ||
      user.role != Role.ADMIN
    ) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
