import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetProjectQuery } from '../get-project.query';
import { Project } from 'src/infrastructure/models/project.entity';
import { GetProjectResponse } from '../../data-transfer-objects/get-project-response.dto';

@QueryHandler(GetProjectQuery)
export class GetProjectHandler implements IQueryHandler<GetProjectQuery> {
  private readonly logger = new Logger(GetProjectHandler.name);

  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async execute(query: GetProjectQuery): Promise<GetProjectResponse> {
    /* this.logger.log(`Handling GetProjectQuery: ${JSON.stringify(query)}`); */

    const { projectId } = query;

    try {
      const project = await this.projectRepository.findOne({
        where: { id: projectId },
        relations: ['medias'],
      });

      if (!project) {
        throw new NotFoundException('Project not found');
      }

      const getProjectResponse = {
        id: project.id,
        title: project.title,
        category: project.category,
        text: project.text,
        link: project.link,
        imageMediaId: project.imageMediaId,
        background: project.background,
        medias: project.medias,
        updatedAt: project.updatedAt,
      } as GetProjectResponse;

      /* this.logger.log(
        `Successfully executed GetProjectQuery: ${JSON.stringify(
          getProjectResponse,
        )}`,
      ); */

      return getProjectResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
