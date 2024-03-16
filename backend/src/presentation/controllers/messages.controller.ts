import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

import { CreateMessageRequest } from '../../domains/message-management/data-transfer-objects/create-message-request.dto';
import { MarkAsReadRequest } from 'src/domains/message-management/data-transfer-objects/mark-message-as-read-request.dto';
import { DeleteMessageRequest } from 'src/domains/message-management/data-transfer-objects/delete-message-request.dto';

import { GetMessageResponse } from '../../domains/message-management/data-transfer-objects/get-message-response.dto';
import { GetMessageListResponse } from '../../domains/message-management/data-transfer-objects/get-message-list-response.dto';

import { CreateMessageCommand } from '../../domains/message-management/commands/create-message.command';
import { DeleteMessageCommand } from 'src/domains/message-management/commands/delete-message.command';
import { MarkAsReadCommand } from 'src/domains/message-management/commands/mark-message-as-read.command';

import { GetAllMessagesQuery } from '../../domains/message-management/queries/get-all-messages.query';
import { GetMessageQuery } from '../../domains/message-management/queries/get-message.query';
import { UpdateMessageResponse } from 'src/domains/message-management/data-transfer-objects/update-message-response.dto';

@Controller('messages')
export class MessagesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  create(@Body() createMessageRequest: CreateMessageRequest): Promise<void> {
    return this.commandBus.execute(
      new CreateMessageCommand(createMessageRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('markAsRead')
  markAsRead(
    @Body() markAsReadRequest: MarkAsReadRequest,
  ): Promise<UpdateMessageResponse> {
    return this.commandBus.execute(new MarkAsReadCommand(markAsReadRequest));
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(@Body() deleteMessageRequest: DeleteMessageRequest): Promise<void> {
    return this.commandBus.execute(
      new DeleteMessageCommand(deleteMessageRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getAll')
  getAll(
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ): Promise<GetMessageListResponse[]> {
    return this.queryBus.execute(new GetAllMessagesQuery(pageNumber, pageSize));
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getById/:messageId')
  getById(@Param('messageId') messageId: number): Promise<GetMessageResponse> {
    return this.queryBus.execute(new GetMessageQuery(messageId));
  }
}
