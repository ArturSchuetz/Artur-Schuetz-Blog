import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  GetProjectListResponse,
  GetProjectListPaginatedResponse,
} from '../../data-transfer-objects/get-project-list-response.dto';
import { GetAllProjectsQuery } from '../get-all-projects.query';
import { Project } from 'src/infrastructure/models/project.entity';

@QueryHandler(GetAllProjectsQuery)
export class GetAllProjectsHandler
  implements IQueryHandler<GetAllProjectsQuery>
{
  private readonly logger = new Logger(GetAllProjectsHandler.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async execute(
    query: GetAllProjectsQuery,
  ): Promise<GetProjectListPaginatedResponse> {
    /* this.logger.log(`Handling GetAllProjectsQuery: ${JSON.stringify(query)}`); */

    const { pageNumber = 1, pageSize = 10 } = query;

    if (pageNumber <= 0 || pageSize <= 0) {
      this.logger.error('Invalid page number or page size.');
      throw new Error('Invalid page number or page size.');
    }

    const offset: number = (pageNumber - 1) * pageSize;

    let projects: Project[];
    let count: number;

    try {
      [projects, count] = await this.projectRepository.findAndCount({
        skip: offset,
        take: pageSize,
      });
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }

    const getProjectListPaginatedResponse: GetProjectListPaginatedResponse = {
      currentPage: pageNumber,
      totalCount: count,
      data: projects.map((project) => {
        const getProjectListResponse = new GetProjectListResponse();
        getProjectListResponse.id = project.id;
        getProjectListResponse.title = project.title;
        getProjectListResponse.category = project.category;
        getProjectListResponse.text = project.text;
        getProjectListResponse.link = project.link;
        getProjectListResponse.imageMediaId = project.imageMediaId;
        getProjectListResponse.background = project.background;
        getProjectListResponse.updatedAt = project.updatedAt;
        return getProjectListResponse;
      }),
    };

    /* this.logger.log(
      `Successfully executed GetAllProjectsQuery: ${JSON.stringify(
        getProjectListPaginatedResponse,
      )}`,
    ); */

    return getProjectListPaginatedResponse;
  }
}
