import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { HelperService } from 'src/application/services/helper.service';

import { CreateTutorialChapterCommand } from '../create-chapter.command';
import { TutorialChapter } from 'src/infrastructure/models/tutorial-chapter.entity';
import { TutorialChapterCreatedEvent } from '../../events/chapter-created.event';
import { TutorialChapterAggregate } from '../../aggregates/tutorial-chapter.aggregate';

@CommandHandler(CreateTutorialChapterCommand)
export class CreateTutorialChapterCommandHandler
  implements ICommandHandler<CreateTutorialChapterCommand>
{
  private readonly logger = new Logger(CreateTutorialChapterCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(TutorialChapter)
    private readonly chapterRepository: Repository<TutorialChapter>,
  ) {}

  async execute(command: CreateTutorialChapterCommand): Promise<TutorialChapter> {
    const { createTutorialChapterRequest } = command;
    const { name, position } = createTutorialChapterRequest;
    const chapter = await TutorialChapterAggregate.create(0, position, name, this.helperService.createSlug(name), null, null);

    const createChapter = await this.chapterRepository.save(chapter);
    const chapterModel =
      this.eventPublisher.mergeObjectContext(createChapter);
    chapterModel.apply(new TutorialChapterCreatedEvent(chapter.getId()));
    chapterModel.commit();

    /* this.logger.log(
      `Successfully executed CreateTutorialChapterCommand: ${JSON.stringify(
        chapterModel,
      )}`,
    ); */

    return chapterModel;
  }

}
