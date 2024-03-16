import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteProjectCommand } from '../delete-portfolio-project.command';
import { ProjectDeletedEvent } from '../../events/portfolio-project-deleted.event';
import { Project } from 'src/infrastructure/models/project.entity';
import { ProjectAggregate } from '../../aggregates/portfolio-project.aggregate';

@CommandHandler(DeleteProjectCommand)
export class DeleteProjectCommandHandler
  implements ICommandHandler<DeleteProjectCommand>
{
  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async execute(command: DeleteProjectCommand): Promise<boolean> {
    const { deleteProjectRequest } = command;
    const { id } = deleteProjectRequest;

    const toDelete = await this.projectRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      return false;
    }

    const project = await ProjectAggregate.create(
      toDelete.id,
      toDelete.title,
      toDelete.category,
      toDelete.text,
      toDelete.link,
      toDelete.imageMediaId,
      toDelete.background,
    );

    const deleteResult = await this.projectRepository.delete(project.id);
    const projectModel = this.eventPublisher.mergeObjectContext(project);
    projectModel.apply(
      new ProjectDeletedEvent(deleteResult.affected.valueOf()),
    );
    projectModel.commit();

    return true;
  }
}
