import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { DeleteTutorialChapterCommand } from '../delete-chapter.command';
import { TutorialChapterDeletedEvent } from '../../events/chapter-deleted.event';
import { TutorialChapter } from 'src/infrastructure/models/tutorial-chapter.entity';
import { TutorialChapterAggregate } from '../../aggregates/tutorial-chapter.aggregate';

@CommandHandler(DeleteTutorialChapterCommand)
export class DeleteTutorialChapterCommandHandler
  implements ICommandHandler<DeleteTutorialChapterCommand>
{
  private readonly logger = new Logger(DeleteTutorialChapterCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(TutorialChapter)
    private readonly chapterRepository: Repository<TutorialChapter>,
  ) {}

  async execute(command: DeleteTutorialChapterCommand): Promise<boolean> {
    const { deleteChapterRequest } = command;
    const { id } = deleteChapterRequest;

    const toDelete = await this.chapterRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      return false;
    }

    const chapter = await TutorialChapterAggregate.create(
      toDelete.id,
      toDelete.position,
      toDelete.name,
      toDelete.slug,
      toDelete.imageId,
      toDelete.topicId,
    );

    const deleteResult = await this.chapterRepository.delete(chapter.id);
    const chapterModel = this.eventPublisher.mergeObjectContext(chapter);
    if (deleteResult.affected.valueOf() > 0) {
      chapterModel.apply(new TutorialChapterDeletedEvent(chapterModel.getId()));
    }
    chapterModel.commit();

    /* this.logger.log(
      `Successfully executed DeleteTutorialChapterCommand: ${JSON.stringify(
        deleteChapterRequest,
      )}`,
    ); */

    return true;
  }
}
