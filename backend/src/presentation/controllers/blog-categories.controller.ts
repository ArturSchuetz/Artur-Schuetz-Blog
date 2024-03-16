import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

import { AddMediaToBlogCategoryRequest } from '../../domains/medias/data-transfer-objects/add-media-to-blog-category-request.dto';
import { CreateBlogCategoryRequest } from '../../domains/blog-management/data-transfer-objects/create-category-request.dto';
import { DeleteBlogCategoryRequest } from '../../domains/blog-management/data-transfer-objects/delete-category-request.dto';
import { UpdateBlogCategoryRequest } from '../../domains/blog-management/data-transfer-objects/update-category-request.dto';

import { GetBlogCategoryListResponse } from '../../domains/blog-management/data-transfer-objects/get-category-list-response.dto';
import { GetBlogCategoryResponse } from '../../domains/blog-management/data-transfer-objects/get-category-response.dto';
import { UpdateBlogCategoryResponse } from '../../domains/blog-management/data-transfer-objects/update-category-response.dto';

import { AddMediaToBlogCategoryCommand } from '../../domains/medias/commands/add-media-to-blog-category.command';
import { CreateBlogCategoryCommand } from '../../domains/blog-management/commands/create-category.command';
import { DeleteBlogCategoryCommand } from '../../domains/blog-management/commands/delete-category.command';
import { UpdateBlogCategoryCommand } from '../../domains/blog-management/commands/update-category.command';

import { GetAllBlogCategoriesQuery } from '../../domains/blog-management/queries/get-all-categories.query';
import { GetBlogCategoryQuery } from '../../domains/blog-management/queries/get-category.query';

import { HelperService } from '../../application/services/helper.service';

@Controller('blog-categories')
export class BlogCategoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly helperService: HelperService,
  ) {}

  @Get()
  getAll(
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ): Promise<GetBlogCategoryListResponse[]> {
    return this.queryBus.execute(
      new GetAllBlogCategoriesQuery(pageNumber, pageSize),
    );
  }

  @Get('getById')
  getById(
    @Query('categoryId') categoryId: number | string,
  ): Promise<GetBlogCategoryResponse> {

    if (typeof categoryId === 'string' && !this.helperService.isValidSlug(categoryId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(new GetBlogCategoryQuery(categoryId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCategoryRequest: CreateBlogCategoryRequest): Promise<void> {
    return this.commandBus.execute<CreateBlogCategoryCommand, void>(
      new CreateBlogCategoryCommand(createCategoryRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(
    @Body() updateCategoryRequest: UpdateBlogCategoryRequest,
  ): Promise<UpdateBlogCategoryResponse> {
    return this.commandBus.execute<
      UpdateBlogCategoryCommand,
      UpdateBlogCategoryResponse
    >(new UpdateBlogCategoryCommand(updateCategoryRequest));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('addMedia')
  addMediaToCategory(
    @Body() addMediaToCategoryRequest: AddMediaToBlogCategoryRequest,
  ): Promise<boolean> {
    return this.commandBus
      .execute<AddMediaToBlogCategoryCommand, boolean>(
        new AddMediaToBlogCategoryCommand(addMediaToCategoryRequest),
      )
      .then((result) => {
        if (result) {
          return this.queryBus.execute(
            new GetBlogCategoryQuery(addMediaToCategoryRequest.categoryId),
          );
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(
    @Body() deleteCategoryRequest: DeleteBlogCategoryRequest,
  ): Promise<boolean> {
    return this.commandBus.execute<DeleteBlogCategoryCommand, boolean>(
      new DeleteBlogCategoryCommand(deleteCategoryRequest),
    );
  }
}
