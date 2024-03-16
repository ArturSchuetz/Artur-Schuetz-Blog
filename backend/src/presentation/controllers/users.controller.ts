import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Put,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserRequest } from '../../domains/user-management/data-transfer-objects/create-user-request.dto';
import { DeleteUserRequest } from '../../domains/user-management/data-transfer-objects/delete-user-request.dto';
import { UpdateUserRequest } from '../../domains/user-management/data-transfer-objects/update-user-request.dto';

import { CreateUserResponse } from '../../domains/user-management/data-transfer-objects/create-user-response.dto';
import { GetUserListResponse } from '../../domains/user-management/data-transfer-objects/get-user-list-response.dto';
import { GetUserResponse } from '../../domains/user-management/data-transfer-objects/get-user-response.dto';
import { UpdateUserResponse } from '../../domains/user-management/data-transfer-objects/update-user-response.dto';

import { GetAllUsersQuery } from '../../domains/user-management/queries/get-all-users.query';
import { GetUserQuery } from '../../domains/user-management/queries/get-user.query';

import { CreateUserCommand } from '../../domains/user-management/commands/create-user.command';
import { UpdateUserCommand } from '../../domains/user-management/commands/update-user.command';
import { DeleteUserCommand } from '../../domains/user-management/commands/delete-user.command';
import { AddMediaToUserRequest } from 'src/domains/medias/data-transfer-objects/add-media-to-user-request.dto';
import { AddMediaToUserCommand } from 'src/domains/medias/commands/add-media-to-user.command';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createUserRequest: CreateUserRequest,
  ): Promise<CreateUserResponse> {
    return this.commandBus.execute<CreateUserCommand, CreateUserResponse>(
      new CreateUserCommand(createUserRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getById')
  getById(@Query('userId') userId: number): Promise<GetUserResponse> {
    return this.queryBus.execute(new GetUserQuery(userId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getCurrentUser')
  getCurrentUser(@Req() request): Promise<GetUserResponse> {
    return this.queryBus.execute(new GetUserQuery(request.user.id));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getAll')
  getAll(
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ): Promise<GetUserListResponse[]> {
    return this.queryBus.execute(new GetAllUsersQuery(pageNumber, pageSize));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(
    @Body() updateUserRequest: UpdateUserRequest,
  ): Promise<UpdateUserResponse> {
    return this.commandBus.execute<UpdateUserCommand, UpdateUserResponse>(
      new UpdateUserCommand(updateUserRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('addMedia')
  addMediaToUser(
    @Body() addMediaToUserRequest: AddMediaToUserRequest,
  ): Promise<boolean> {
    return this.commandBus
      .execute<AddMediaToUserCommand, boolean>(
        new AddMediaToUserCommand(addMediaToUserRequest),
      )
      .then((result) => {
        if (result) {
          return this.queryBus.execute(
            new GetUserQuery(addMediaToUserRequest.userId),
          );
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(@Body() deleteUserRequest: DeleteUserRequest): Promise<boolean> {
    return this.commandBus.execute<DeleteUserCommand, boolean>(
      new DeleteUserCommand(deleteUserRequest),
    );
  }
}
