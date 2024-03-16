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
import { createHash } from 'crypto';

import { AddMediaToTutorialArticleRequest } from '../../domains/medias/data-transfer-objects/add-media-to-tutorial-article-request.dto';

import { CreateTutorialArticleRequest } from '../../domains/tutorial-management/data-transfer-objects/create-article-request.dto';
import { DeleteTutorialArticleRequest } from '../../domains/tutorial-management/data-transfer-objects/delete-article-request.dto';
import { PublishTutorialArticleRequest } from '../../domains/tutorial-management/data-transfer-objects/publish-article-request.dto';
import { UpdateTutorialArticleRequest } from '../../domains/tutorial-management/data-transfer-objects/update-article-request.dto';

import { GetTutorialArticleListResponse } from '../../domains/tutorial-management/data-transfer-objects/get-article-list-response.dto';
import { GetTutorialArticleResponse } from '../../domains/tutorial-management/data-transfer-objects/get-article-response.dto';
import { UpdateTutorialArticleResponse } from '../../domains/tutorial-management/data-transfer-objects/update-article-response.dto';

import { AddMediaToTutorialArticleCommand } from '../../domains/medias/commands/add-media-to-tutorial-article.command';

import { CreateTutorialArticleCommand } from '../../domains/tutorial-management/commands/create-article.command';
import { DeleteTutorialArticleCommand } from '../../domains/tutorial-management/commands/delete-article.command';
import { PublishTutorialArticleCommand } from '../../domains/tutorial-management/commands/publish-article.command';
import { UpdateTutorialArticleCommand } from '../../domains/tutorial-management/commands/update-article.command';

import { GetTutorialArticleQuery } from '../../domains/tutorial-management/queries/get-article.query';
import { GetTutorialArticleMetaQuery } from '../../domains/tutorial-management/queries/get-article-meta.query';
import { GetAllTutorialArticlesQuery } from '../../domains/tutorial-management/queries/get-all-articles.query';
import { GetTutorialArticlesByChapterQuery } from '../../domains/tutorial-management/queries/get-articles-by-chapter.query';

import { GetTutorialArticleViewsOverviewResponse } from 'src/domains/tutorial-management/data-transfer-objects/get-article-views-overview-response.dto';
import { GetTutorialArticleViewsOverviewQuery } from 'src/domains/tutorial-management/queries/get-article-views-overview.query';

import { OptionalAuthGuard } from '../../domains/user-management/guards/optional-auth.guard';
import { HelperService } from '../../application/services/helper.service';

@Controller('tutorial-articles')
export class TutorialArticlesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly helperService: HelperService,
  ) {}

  @UseGuards(OptionalAuthGuard)
  @Get('getMetaById')
  getMetaById(
    @Query('articleId') articleId: number | string,
    @Req() request,
  ): Promise<GetTutorialArticleResponse> {
    if (typeof articleId === 'string' && !this.helperService.isValidSlug(articleId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(new GetTutorialArticleMetaQuery(articleId, !!request.user));
  }

  @UseGuards(OptionalAuthGuard)
  @Get('getById')
  getById(
    @Query('articleId') articleId: number | string,
    @Req() request,
  ): Promise<GetTutorialArticleResponse> {
    if (typeof articleId === 'string' && !this.helperService.isValidSlug(articleId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(new GetTutorialArticleQuery(articleId, !!request.user));
  }

  @UseGuards(OptionalAuthGuard)
  @Get()
  getAll(
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Req() request,
  ): Promise<GetTutorialArticleListResponse[]> {
    return this.queryBus.execute(
      new GetAllTutorialArticlesQuery(pageNumber, pageSize, !!request.user),
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get('byChapter')
  getByCategory(
    @Query('chapterId') chapterId: number | string,
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Req() request,
  ): Promise<GetTutorialArticleListResponse[]> {

    if (typeof chapterId === 'string' && !this.helperService.isValidSlug(chapterId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(
      new GetTutorialArticlesByChapterQuery(
        chapterId,
        pageNumber,
        pageSize,
        !!request.user,
      ),
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get('getViewsOverview')
  getViewsOverview(
    @Req() request,
  ): Promise<GetTutorialArticleViewsOverviewResponse> {
    return this.queryBus.execute(
      new GetTutorialArticleViewsOverviewQuery(
        !!request.user,
      ),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createTutorialRequest: CreateTutorialArticleRequest,
    @Req() request,
  ): Promise<void> {
    createTutorialRequest.authorId = request.user.id;
    return this.commandBus.execute<CreateTutorialArticleCommand, void>(
      new CreateTutorialArticleCommand(createTutorialRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(
    @Body() updateTutorialRequest: UpdateTutorialArticleRequest,
  ): Promise<UpdateTutorialArticleResponse> {
    return this.commandBus.execute<UpdateTutorialArticleCommand, UpdateTutorialArticleResponse>(
      new UpdateTutorialArticleCommand(updateTutorialRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('publish')
  publish(
    @Body() pubishTutorialRequest: PublishTutorialArticleRequest,
  ): Promise<UpdateTutorialArticleResponse> {
    return this.commandBus.execute<
      PublishTutorialArticleCommand,
      UpdateTutorialArticleResponse
    >(new PublishTutorialArticleCommand(pubishTutorialRequest));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('addMedia')
  addMediaToTutorial(
    @Body() addMediaToTutorialRequest: AddMediaToTutorialArticleRequest,
    @Req() request,
  ): Promise<boolean> {
    return this.commandBus
      .execute<AddMediaToTutorialArticleCommand, boolean>(
        new AddMediaToTutorialArticleCommand(addMediaToTutorialRequest),
      )
      .then((result) => {
        if (result) {
          return this.queryBus.execute(
            new GetTutorialArticleQuery(addMediaToTutorialRequest.articleId, !!request.user),
          );
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(@Body() deleteTutorialRequest: DeleteTutorialArticleRequest): Promise<boolean> {
    return this.commandBus.execute<DeleteTutorialArticleCommand, boolean>(
      new DeleteTutorialArticleCommand(deleteTutorialRequest),
    );
  }
}
