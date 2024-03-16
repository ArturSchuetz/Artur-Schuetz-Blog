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

import { AddMediaToBlogArticleRequest } from '../../domains/medias/data-transfer-objects/add-media-to-blog-article-request.dto';
import { CreateBlogArticleRequest } from '../../domains/blog-management/data-transfer-objects/create-article-request.dto';
import { DeleteBlogArticleRequest } from '../../domains/blog-management/data-transfer-objects/delete-article-request.dto';
import { PublishBlogArticleRequest } from '../../domains/blog-management/data-transfer-objects/publish-article-request.dto';
import { UpdateBlogArticleRequest } from '../../domains/blog-management/data-transfer-objects/update-article-request.dto';

import { GetArticleListPaginatedResponse, GetBlogArticleListResponse } from '../../domains/blog-management/data-transfer-objects/get-article-list-response.dto';
import { GetBlogArticleResponse } from '../../domains/blog-management/data-transfer-objects/get-article-response.dto';
import { UpdateBlogArticleResponse } from '../../domains/blog-management/data-transfer-objects/update-article-response.dto';

import { AddMediaToBlogArticleCommand } from '../../domains/medias/commands/add-media-to-blog-article.command';
import { CreateBlogArticleCommand } from '../../domains/blog-management/commands/create-article.command';
import { DeleteBlogArticleCommand } from '../../domains/blog-management/commands/delete-article.command';
import { PublishBlogArticleCommand } from '../../domains/blog-management/commands/publish-article.command';
import { UpdateBlogArticleCommand } from '../../domains/blog-management/commands/update-article.command';

import { GetBlogArticleQuery } from '../../domains/blog-management/queries/get-article.query';
import { GetBlogArticleMetaQuery } from '../../domains/blog-management/queries/get-article-meta.query';
import { GetAllBlogArticlesQuery } from '../../domains/blog-management/queries/get-all-articles.query';
import { GetBlogArticlesByCategoryQuery } from '../../domains/blog-management/queries/get-articles-by-category.query';

import { GetBlogArticleViewsOverviewResponse } from 'src/domains/blog-management/data-transfer-objects/get-article-views-overview-response.dto';
import { GetBlogArticleViewsOverviewQuery } from 'src/domains/blog-management/queries/get-article-views-overview.query';

@Controller('blog-articles')
export class BlogArticlesController {
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
  ): Promise<GetBlogArticleResponse> {
    if (typeof articleId === 'string' && !this.helperService.isValidSlug(articleId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(new GetBlogArticleMetaQuery(articleId, !!request.user));
  }

  @UseGuards(OptionalAuthGuard)
  @Get('getById')
  getById(
    @Query('articleId') articleId: number | string,
    @Req() request,
  ): Promise<GetBlogArticleResponse> {
    if (typeof articleId === 'string' && !this.helperService.isValidSlug(articleId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(new GetBlogArticleQuery(articleId, !!request.user));
  }

  @UseGuards(OptionalAuthGuard)
  @Get()
  getAll(
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Req() request,
  ): Promise<GetArticleListPaginatedResponse> {
    return this.queryBus.execute(
      new GetAllBlogArticlesQuery(pageNumber, pageSize, !!request.user),
    );
  }

  @UseGuards(OptionalAuthGuard)
  @Get('byCategory')
  getByCategory(
    @Query('categoryId') categoryId: number | string,
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
    @Req() request,
  ): Promise<GetBlogArticleListResponse[]> {

    if (typeof categoryId === 'string' && !this.helperService.isValidSlug(categoryId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(
      new GetBlogArticlesByCategoryQuery(
        categoryId,
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
  ): Promise<GetBlogArticleViewsOverviewResponse> {
    return this.queryBus.execute(
      new GetBlogArticleViewsOverviewQuery(
        !!request.user,
      ),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createArticleRequest: CreateBlogArticleRequest,
    @Req() request,
  ): Promise<void> {
    createArticleRequest.authorId = request.user.id;
    return this.commandBus.execute<CreateBlogArticleCommand, void>(
      new CreateBlogArticleCommand(createArticleRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(
    @Body() updateArticleRequest: UpdateBlogArticleRequest,
  ): Promise<UpdateBlogArticleResponse> {
    return this.commandBus.execute<UpdateBlogArticleCommand, UpdateBlogArticleResponse>(
      new UpdateBlogArticleCommand(updateArticleRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('publish')
  publish(
    @Body() pubishArticleRequest: PublishBlogArticleRequest,
  ): Promise<UpdateBlogArticleResponse> {
    return this.commandBus.execute<
      PublishBlogArticleCommand,
      UpdateBlogArticleResponse
    >(new PublishBlogArticleCommand(pubishArticleRequest));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('addMedia')
  addMediaToArticle(
    @Body() addMediaToArticleRequest: AddMediaToBlogArticleRequest,
    @Req() request,
  ): Promise<boolean> {
    return this.commandBus
      .execute<AddMediaToBlogArticleCommand, boolean>(
        new AddMediaToBlogArticleCommand(addMediaToArticleRequest),
      )
      .then((result) => {
        if (result) {
          return this.queryBus.execute(
            new GetBlogArticleQuery(addMediaToArticleRequest.articleId, !!request.user),
          );
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(@Body() deleteArticleRequest: DeleteBlogArticleRequest): Promise<boolean> {
    return this.commandBus.execute<DeleteBlogArticleCommand, boolean>(
      new DeleteBlogArticleCommand(deleteArticleRequest),
    );
  }
}
