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

import { OptionalAuthGuard } from '../../domains/user-management/guards/optional-auth.guard';
import { HelperService } from '../../application/services/helper.service';

import { AddMediaToTutorialTopicRequest } from '../../domains/medias/data-transfer-objects/add-media-to-tutorial-topic-request.dto';
import { CreateTutorialTopicRequest } from '../../domains/tutorial-management/data-transfer-objects/create-topic-request.dto';
import { DeleteTutorialTopicRequest } from '../../domains/tutorial-management/data-transfer-objects/delete-topic-request.dto';
import { UpdateTutorialTopicRequest } from '../../domains/tutorial-management/data-transfer-objects/update-topic-request.dto';

import { GetTutorialTopicListResponse } from '../../domains/tutorial-management/data-transfer-objects/get-topic-list-response.dto';
import { GetTutorialTopicResponse } from '../../domains/tutorial-management/data-transfer-objects/get-topic-response.dto';
import { UpdateTutorialTopicResponse } from '../../domains/tutorial-management/data-transfer-objects/update-topic-response.dto';

import { AddMediaToTutorialTopicCommand } from '../../domains/medias/commands/add-media-to-tutorial-topic.command';
import { CreateTutorialTopicCommand } from '../../domains/tutorial-management/commands/create-topic.command';
import { DeleteTutorialTopicCommand } from '../../domains/tutorial-management/commands/delete-topic.command';
import { UpdateTutorialTopicCommand } from '../../domains/tutorial-management/commands/update-topic.command';

import { GetAllTutorialTopicsQuery } from '../../domains/tutorial-management/queries/get-all-topics.query';
import { GetAllTutorialCategoryTopicsQuery } from '../../domains/tutorial-management/queries/get-all-category-topics.query';
import { GetTutorialTopicQuery } from '../../domains/tutorial-management/queries/get-topic.query';

@Controller('tutorial-topics')
export class TutorialTopicsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly helperService: HelperService,
  ) {}

  @UseGuards(OptionalAuthGuard)
  @Get()
  getAll(
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Req() request,
  ): Promise<GetTutorialTopicListResponse[]> {
    return this.queryBus.execute(
      new GetAllTutorialTopicsQuery(pageNumber, pageSize, !!request.user),
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get('getAllByCategory')
  getAllByCategory(
    @Query('categoryId') categoryId: number,
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Req() request,
  ): Promise<GetTutorialTopicListResponse[]> {
    return this.queryBus.execute(
      new GetAllTutorialCategoryTopicsQuery(categoryId, pageNumber, pageSize, !!request.user),
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get('getById')
  getById(
    @Query('topicId') topicId: number | string,
    @Req() request,
  ): Promise<GetTutorialTopicResponse> {
    if (typeof topicId === 'string' && !this.helperService.isValidSlug(topicId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(new GetTutorialTopicQuery(topicId, !!request.user));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createTopicRequest: CreateTutorialTopicRequest): Promise<void> {
    return this.commandBus.execute<CreateTutorialTopicCommand, void>(
      new CreateTutorialTopicCommand(createTopicRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(
    @Body() updateTopicRequest: UpdateTutorialTopicRequest,
  ): Promise<UpdateTutorialTopicResponse> {
    return this.commandBus.execute<
      UpdateTutorialTopicCommand,
      UpdateTutorialTopicResponse
    >(new UpdateTutorialTopicCommand(updateTopicRequest));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('addMedia')
  addMediaToTopic(
    @Body() addMediaToTopicRequest: AddMediaToTutorialTopicRequest,
    @Req() request,
  ): Promise<boolean> {
    return this.commandBus
      .execute<AddMediaToTutorialTopicCommand, boolean>(
        new AddMediaToTutorialTopicCommand(addMediaToTopicRequest),
      )
      .then((result) => {
        if (result) {
          return this.queryBus.execute(
            new GetTutorialTopicQuery(addMediaToTopicRequest.topicId, !!request.user),
          );
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(
    @Body() deleteTopicRequest: DeleteTutorialTopicRequest,
  ): Promise<boolean> {
    return this.commandBus.execute<DeleteTutorialTopicCommand, boolean>(
      new DeleteTutorialTopicCommand(deleteTopicRequest),
    );
  }
}
