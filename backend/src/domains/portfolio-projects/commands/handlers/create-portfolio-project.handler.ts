import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectCommand } from '../create-portfolio-project.command';
import { ProjectCreatedEvent } from '../../events/portfolio-project-created.event';
import { Project } from 'src/infrastructure/models/project.entity';
import { ProjectAggregate } from '../../aggregates/portfolio-project.aggregate';
import { CreateProjectResponse } from '../../data-transfer-objects/create-portfolio-project-response.dto';

@CommandHandler(CreateProjectCommand)
export class CreateProjectCommandHandler
  implements ICommandHandler<CreateProjectCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async execute(command: CreateProjectCommand): Promise<CreateProjectResponse> {
    const { createProjectRequest } = command;
    const { title, category, text, imageMediaId, background, link } =
      createProjectRequest;

    const project = await ProjectAggregate.create(
      0,
      title,
      category,
      text,
      link,
      imageMediaId,
      background,
    );

    const createdProject = await this.projectRepository.save(project);
    const projectModel = this.eventPublisher.mergeObjectContext(createdProject);
    projectModel.apply(new ProjectCreatedEvent(project.getId()));
    projectModel.commit();

    const getProjectResponse: CreateProjectResponse = {
      id: projectModel.id,
      title: projectModel.title,
      category: projectModel.category,
      text: projectModel.text,
      link: projectModel.link,
      imageMediaId: projectModel.imageMediaId,
      background: projectModel.background,
    };

    return getProjectResponse;
  }
}
