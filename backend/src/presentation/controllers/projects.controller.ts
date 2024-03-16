import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthGuard } from '@nestjs/passport';

import { AddMediaToProjectRequest } from '../../domains/medias/data-transfer-objects/add-media-to-project-request.dto';
import { CreateProjectRequest } from '../../domains/portfolio-projects/data-transfer-objects/create-portfolio-project-request.dto';
import { DeleteProjectRequest } from '../../domains/portfolio-projects/data-transfer-objects/delete-portfolio-project-request.dto';
import { UpdateProjectRequest } from '../../domains/portfolio-projects/data-transfer-objects/update-project-request.dto';

import { CreateProjectResponse } from '../../domains/portfolio-projects/data-transfer-objects/create-portfolio-project-response.dto';
import { GetProjectListResponse } from '../../domains/portfolio-projects/data-transfer-objects/get-project-list-response.dto';
import { GetProjectResponse } from '../../domains/portfolio-projects/data-transfer-objects/get-project-response.dto';
import { UpdateProjectResponse } from '../../domains/portfolio-projects/data-transfer-objects/update-project-response.dto';

import { GetAllProjectsQuery } from '../../domains/portfolio-projects/queries/get-all-projects.query';
import { GetProjectQuery } from '../../domains/portfolio-projects/queries/get-project.query';

import { AddMediaToProjectCommand } from '../../domains/medias/commands/add-media-to-project.command';
import { CreateProjectCommand } from '../../domains/portfolio-projects/commands/create-portfolio-project.command';
import { UpdateProjectCommand } from '../../domains/portfolio-projects/commands/update-portfolio-project.command';
import { DeleteProjectCommand } from '../../domains/portfolio-projects/commands/delete-portfolio-project.command';

@Controller('projects')
export class ProjectsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get('getAll')
  getAll(
    @Query('page') pageNumber: number,
    @Query('pageSize') pageSize: number,
  ): Promise<GetProjectListResponse[]> {
    return this.queryBus.execute(new GetAllProjectsQuery(pageNumber, pageSize));
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(
    @Body() createProjectRequest: CreateProjectRequest,
  ): Promise<CreateProjectResponse> {
    return this.commandBus.execute<CreateProjectCommand, CreateProjectResponse>(
      new CreateProjectCommand(createProjectRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('getById')
  getById(@Query('projectId') projectId: number): Promise<GetProjectResponse> {
    return this.queryBus.execute(new GetProjectQuery(projectId));
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  update(
    @Body() updateProjectRequest: UpdateProjectRequest,
  ): Promise<UpdateProjectResponse> {
    return this.commandBus.execute<UpdateProjectCommand, UpdateProjectResponse>(
      new UpdateProjectCommand(updateProjectRequest),
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('addMedia')
  addMediaToProject(
    @Body() addMediaToProjectRequest: AddMediaToProjectRequest,
  ): Promise<boolean> {
    return this.commandBus
      .execute<AddMediaToProjectCommand, boolean>(
        new AddMediaToProjectCommand(addMediaToProjectRequest),
      )
      .then((result) => {
        if (result) {
          return this.queryBus.execute(
            new GetProjectQuery(addMediaToProjectRequest.projectId),
          );
        }
      });
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete()
  delete(@Body() deleteProjectRequest: DeleteProjectRequest): Promise<boolean> {
    return this.commandBus.execute<DeleteProjectCommand, boolean>(
      new DeleteProjectCommand(deleteProjectRequest),
    );
  }
}
