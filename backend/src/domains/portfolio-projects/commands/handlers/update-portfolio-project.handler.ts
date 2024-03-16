import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateProjectCommand } from '../update-portfolio-project.command';
import { ProjectUpdatedEvent } from '../../events/portfolio-project-updated.event';
import { UpdateProjectResponse } from '../../data-transfer-objects/update-project-response.dto';
import { ProjectAggregate } from '../../aggregates/portfolio-project.aggregate';
import { Project } from '../../../../infrastructure/models/project.entity';

@CommandHandler(UpdateProjectCommand)
export class UpdateProjectCommandHandler
  implements ICommandHandler<UpdateProjectCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async execute(command: UpdateProjectCommand): Promise<UpdateProjectResponse> {
    const { updateProjectRequest } = command;
    const { id, title, category, text, imageMediaId, background, link } =
      updateProjectRequest;

    const existingProject = await this.projectRepository.findOne({
      where: { id },
      relations: ['medias'],
    });

    if (!existingProject) {
      throw new Error('Projekt nicht gefunden');
    }

    const project = await ProjectAggregate.create(
      existingProject.id,
      title,
      category,
      text,
      link,
      typeof imageMediaId === 'number' && !isNaN(imageMediaId)
        ? imageMediaId
        : null,
      background,
    );

    const updatedProject = await this.projectRepository.save(project);

    const projectModel = this.eventPublisher.mergeObjectContext(updatedProject);
    projectModel.apply(new ProjectUpdatedEvent(id));
    projectModel.commit();

    const updateProjectResponse: UpdateProjectResponse = {
      id: updatedProject.id,
      title: updatedProject.title,
      category: updatedProject.category,
      text: updatedProject.text,
      link: updatedProject.link,
      imageMediaId: updatedProject.imageMediaId,
      background: updatedProject.background,
      medias: existingProject.medias,
    };

    return updateProjectResponse;
  }
}
