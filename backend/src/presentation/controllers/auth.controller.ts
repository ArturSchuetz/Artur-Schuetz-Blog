import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserCommand } from '../../domains/user-management/commands/create-user.command';
import { RefreshTokenCommand } from 'src/domains/user-management/commands/refresh-token.command';
import { LoginUserCommand } from '../../domains/user-management/commands/login-user.command';
import { LogoutUserCommand } from 'src/domains/user-management/commands/logout-user.command';

import { CreateUserRequest } from '../../domains/user-management/data-transfer-objects/create-user-request.dto';
import { RefreshTokenRequest } from 'src/domains/user-management/data-transfer-objects/refresh-token-request.dto';
import { LoginUserRequest } from '../../domains/user-management/data-transfer-objects/login-user-request.dto';
import { LogoutUserRequest } from 'src/domains/user-management/data-transfer-objects/logout-user-request.dto';

import { CreateUserResponse } from '../../domains/user-management/data-transfer-objects/create-user-response.dto';
import { RefreshTokenResponse } from 'src/domains/user-management/data-transfer-objects/refresh-token-response.dto';
import { LoginUserResponse } from '../../domains/user-management/data-transfer-objects/login-user-response.dto';
import { LogoutUserResponse } from 'src/domains/user-management/data-transfer-objects/logout-user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post('login')
  login(
    @Body() loginUserRequest: LoginUserRequest,
  ): Promise<LoginUserResponse> {
    return this.commandBus.execute<LoginUserCommand, LoginUserResponse>(
      new LoginUserCommand(loginUserRequest),
    );
  }

  @Post('refresh-token')
  refreshToken(
    @Body() refreshTokenRequest: RefreshTokenRequest,
  ): Promise<RefreshTokenResponse> {
    return this.commandBus.execute<RefreshTokenCommand, RefreshTokenResponse>(
      new RefreshTokenCommand(refreshTokenRequest),
    );
  }

  @Post('register')
  register(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return this.commandBus.execute<CreateUserCommand, CreateUserResponse>(
      new CreateUserCommand(createUserRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  logout(
    @Body() logoutUserRequest: LogoutUserRequest,
  ): Promise<LogoutUserResponse> {
    return this.commandBus.execute<LogoutUserCommand, LogoutUserResponse>(
      new LogoutUserCommand(logoutUserRequest),
    );
  }
}
