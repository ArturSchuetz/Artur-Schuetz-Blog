import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { HelperService } from 'src/application/services/helper.service';

import { UpdateTutorialChapterCommand } from '../update-chapter.command';
import { TutorialChapterUpdatedEvent } from '../../events/chapter-updated.event';
import { TutorialChapter } from 'src/infrastructure/models/tutorial-chapter.entity';
import { UpdateTutorialChapterResponse } from '../../data-transfer-objects/update-chapter-response.dto';
import { TutorialChapterAggregate } from '../../aggregates/tutorial-chapter.aggregate';

@CommandHandler(UpdateTutorialChapterCommand)
export class UpdateTutorialChapterCommandHandler
  implements ICommandHandler<UpdateTutorialChapterCommand>
{
  private readonly logger = new Logger(UpdateTutorialChapterCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(TutorialChapter)
    private readonly chapterRepository: Repository<TutorialChapter>,
  ) {}

  async execute(
    command: UpdateTutorialChapterCommand,
  ): Promise<UpdateTutorialChapterResponse> {
    const { updateTutorialChapterRequest } = command;
    const { id, position, name, imageId, topicId } = updateTutorialChapterRequest;

    const existingChapter = await this.chapterRepository.findOne({
      where: { id },
      relations: ['medias'],
    });

    if (!existingChapter) {
      throw new Error('Projekt nicht gefunden');
    }

    const chapter = await TutorialChapterAggregate.create(
      existingChapter.id,
      position,
      name,
      this.helperService.createSlug(name),
      imageId,
      topicId,
    );

    const updatedChapter = await this.chapterRepository.save(chapter);

    const chapterModel =
      this.eventPublisher.mergeObjectContext(updatedChapter);
    chapterModel.apply(new TutorialChapterUpdatedEvent(id));
    chapterModel.commit();

    const updateChapterResponse: UpdateTutorialChapterResponse = {
      id: updatedChapter.id,
      position: updatedChapter.position,
      name: updatedChapter.name,
      slug: updatedChapter.slug,
      imageId: updatedChapter.imageId,
      topicId: updatedChapter.topicId,
      medias: existingChapter.medias,
    };

    /*
    this.logger.log(
      `Successfully executed UpdateTutorialChapterCommand: ${JSON.stringify(
        updateChapterResponse,
      )}`,
    );
    */

    return updateChapterResponse;
  }
}
