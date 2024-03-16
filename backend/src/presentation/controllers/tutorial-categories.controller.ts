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

import { AddMediaToTutorialCategoryRequest } from '../../domains/medias/data-transfer-objects/add-media-to-tutorial-category-request.dto';
import { CreateTutorialCategoryRequest } from '../../domains/tutorial-management/data-transfer-objects/create-category-request.dto';
import { DeleteTutorialCategoryRequest } from '../../domains/tutorial-management/data-transfer-objects/delete-category-request.dto';
import { UpdateTutorialCategoryRequest } from '../../domains/tutorial-management/data-transfer-objects/update-category-request.dto';

import { GetTutorialCategoryListResponse } from '../../domains/tutorial-management/data-transfer-objects/get-category-list-response.dto';
import { GetTutorialCategoryResponse } from '../../domains/tutorial-management/data-transfer-objects/get-category-response.dto';
import { UpdateTutorialCategoryResponse } from '../../domains/tutorial-management/data-transfer-objects/update-category-response.dto';

import { AddMediaToTutorialCategoryCommand } from '../../domains/medias/commands/add-media-to-tutorial-category.command';
import { CreateTutorialCategoryCommand } from '../../domains/tutorial-management/commands/create-category.command';
import { DeleteTutorialCategoryCommand } from '../../domains/tutorial-management/commands/delete-category.command';
import { UpdateTutorialCategoryCommand } from '../../domains/tutorial-management/commands/update-category.command';

import { GetAllTutorialCategoriesQuery } from '../../domains/tutorial-management/queries/get-all-categories.query';
import { GetTutorialCategoryQuery } from '../../domains/tutorial-management/queries/get-category.query';

import { HelperService } from '../../application/services/helper.service';

@Controller('tutorial-categories')
export class TutorialCategoriesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    private readonly helperService: HelperService,
  ) {}

  @Get()
  getAll(
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ): Promise<GetTutorialCategoryListResponse[]> {
    return this.queryBus.execute(
      new GetAllTutorialCategoriesQuery(pageNumber, pageSize),
    );
  }

  @Get('getById')
  getById(
    @Query('categoryId') categoryId: number | string,
  ): Promise<GetTutorialCategoryResponse> {
    if (typeof categoryId === 'string' && !this.helperService.isValidSlug(categoryId)) {
      throw new Error('Ungültiger Slug');
    }

    return this.queryBus.execute(new GetTutorialCategoryQuery(categoryId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createCategoryRequest: CreateTutorialCategoryRequest): Promise<void> {
    return this.commandBus.execute<CreateTutorialCategoryCommand, void>(
      new CreateTutorialCategoryCommand(createCategoryRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(
    @Body() updateCategoryRequest: UpdateTutorialCategoryRequest,
  ): Promise<UpdateTutorialCategoryResponse> {
    return this.commandBus.execute<
      UpdateTutorialCategoryCommand,
      UpdateTutorialCategoryResponse
    >(new UpdateTutorialCategoryCommand(updateCategoryRequest));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('addMedia')
  addMediaToCategory(
    @Body() addMediaToCategoryRequest: AddMediaToTutorialCategoryRequest,
  ): Promise<boolean> {
    return this.commandBus
      .execute<AddMediaToTutorialCategoryCommand, boolean>(
        new AddMediaToTutorialCategoryCommand(addMediaToCategoryRequest),
      )
      .then((result) => {
        if (result) {
          return this.queryBus.execute(
            new GetTutorialCategoryQuery(addMediaToCategoryRequest.categoryId),
          );
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(
    @Body() deleteCategoryRequest: DeleteTutorialCategoryRequest,
  ): Promise<boolean> {
    return this.commandBus.execute<DeleteTutorialCategoryCommand, boolean>(
      new DeleteTutorialCategoryCommand(deleteCategoryRequest),
    );
  }
}
