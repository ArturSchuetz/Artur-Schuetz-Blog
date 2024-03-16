import { ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/infrastructure/models/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OptionalAuthGuard extends AuthGuard('optional-jwt') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly _reflector: Reflector,
  ) {
    super();
  }

  handleRequest(err, user, info) {
    return user;
  }

  canActivate(context: ExecutionContext) {
    const isOptional = this._reflector.getAllAndOverride<boolean>(
      'isOptional',
      [context.getHandler(), context.getClass()],
    );
    if (isOptional) {
      return true;
    }
    return super.canActivate(context);
  }

  async validate(payload: any): Promise<User> {
    //console.log('validate-optional-jwt');
    const { userId, username } = payload;
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user || user.username !== username || !user.isActive) {
      return {} as User;
    }
    return user;
  }
}
