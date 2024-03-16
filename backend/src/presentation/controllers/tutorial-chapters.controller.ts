import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

import { HelperService } from '../../application/services/helper.service';
import { OptionalAuthGuard } from 'src/domains/user-management/guards/optional-auth.guard';

import { AddMediaToTutorialChapterRequest } from '../../domains/medias/data-transfer-objects/add-media-to-tutorial-chapter-request.dto';
import { CreateTutorialChapterRequest } from '../../domains/tutorial-management/data-transfer-objects/create-chapter-request.dto';
import { DeleteTutorialChapterRequest } from '../../domains/tutorial-management/data-transfer-objects/delete-chapter-request.dto';
import { UpdateTutorialChapterRequest } from '../../domains/tutorial-management/data-transfer-objects/update-chapter-request.dto';

import { GetTutorialChapterListResponse } from '../../domains/tutorial-management/data-transfer-objects/get-chapter-list-response.dto';
import { GetTutorialChapterResponse } from '../../domains/tutorial-management/data-transfer-objects/get-chapter-response.dto';
import { UpdateTutorialChapterResponse } from '../../domains/tutorial-management/data-transfer-objects/update-chapter-response.dto';

import { AddMediaToTutorialChapterCommand } from '../../domains/medias/commands/add-media-to-tutorial-chapter.command';
import { CreateTutorialChapterCommand } from '../../domains/tutorial-management/commands/create-chapter.command';
import { DeleteTutorialChapterCommand } from '../../domains/tutorial-management/commands/delete-chapter.command';
import { UpdateTutorialChapterCommand } from '../../domains/tutorial-management/commands/update-chapter.command';

import { GetAllTutorialChaptersQuery } from '../../domains/tutorial-management/queries/get-all-chapters.query';
import { GetTutorialChapterQuery } from '../../domains/tutorial-management/queries/get-chapter.query';

import { GetTutorialChaptersByTopicQuery } from 'src/domains/tutorial-management/queries/get-chapters-by-topic.query';

@Controller('tutorial-chapters')
export class TutorialChaptersController {
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
  ): Promise<GetTutorialChapterListResponse[]> {
    return this.queryBus.execute(
      new GetAllTutorialChaptersQuery(pageNumber, pageSize, !!request.user),
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get('getById')
  getById(
    @Query('chapterId') chapterId: number | string,
    @Req() request,
  ): Promise<GetTutorialChapterResponse> {
    if (typeof chapterId === 'string' && !this.helperService.isValidSlug(chapterId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(new GetTutorialChapterQuery(chapterId, !!request.user));
  }


  @UseGuards(OptionalAuthGuard)
  @Get('getByTopicId')
  getByTopicId(
    @Query('topicId') topicId: number,
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Req() request,
  ): Promise<GetTutorialChapterListResponse[]> {
    if (typeof topicId === 'string' && !this.helperService.isValidSlug(topicId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(
      new GetTutorialChaptersByTopicQuery(topicId, pageNumber, pageSize, !!request.user),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createChapterRequest: CreateTutorialChapterRequest): Promise<void> {
    return this.commandBus.execute<CreateTutorialChapterCommand, void>(
      new CreateTutorialChapterCommand(createChapterRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(
    @Body() updateChapterRequest: UpdateTutorialChapterRequest,
  ): Promise<UpdateTutorialChapterResponse> {
    return this.commandBus.execute<
      UpdateTutorialChapterCommand,
      UpdateTutorialChapterResponse
    >(new UpdateTutorialChapterCommand(updateChapterRequest));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('addMedia')
  addMediaToChapter(
    @Body() addMediaToChapterRequest: AddMediaToTutorialChapterRequest,
    @Req() request,
  ): Promise<boolean> {
    return this.commandBus
      .execute<AddMediaToTutorialChapterCommand, boolean>(
        new AddMediaToTutorialChapterCommand(addMediaToChapterRequest),
      )
      .then((result) => {
        if (result) {
          return this.queryBus.execute(
            new GetTutorialChapterQuery(addMediaToChapterRequest.chapterId, !!request.user),
          );
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(
    @Body() deleteChapterRequest: DeleteTutorialChapterRequest,
  ): Promise<boolean> {
    return this.commandBus.execute<DeleteTutorialChapterCommand, boolean>(
      new DeleteTutorialChapterCommand(deleteChapterRequest),
    );
  }
}
