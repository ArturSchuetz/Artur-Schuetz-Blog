import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTutorialChapterQuery } from '../get-chapter.query';
import { TutorialChapter } from 'src/infrastructure/models/tutorial-chapter.entity';
import { GetTutorialChapterResponse } from '../../data-transfer-objects/get-chapter-response.dto';

@QueryHandler(GetTutorialChapterQuery)
export class GetTutorialChapterHandler implements IQueryHandler<GetTutorialChapterQuery> {
  private readonly logger = new Logger(GetTutorialChapterHandler.name);

  constructor(
    @InjectRepository(TutorialChapter)
    private readonly chapterRepository: Repository<TutorialChapter>,
  ) {}

  async execute(query: GetTutorialChapterQuery): Promise<GetTutorialChapterResponse> {
    /* this.logger.log(`Handling GetTutorialChapterQuery: ${JSON.stringify(query)}`); */

    const { chapterId } = query;

    try {
      let whereCondition;
      if (typeof chapterId === 'number') {
        // Wenn chapterId ein number ist, suche nach ID
        whereCondition = { id: chapterId };
      } else if (typeof chapterId === 'string') {
        // Prüfe, ob die chapterId vollständig numerisch ist
        if (/^\d+$/.test(chapterId)) {
          // Wenn chapterId eine Zeichenkette ist, die nur Zahlen enthält, behandele sie als numerische ID
          whereCondition = { id: parseInt(chapterId, 10) };
        } else {
          // Ansonsten gehe davon aus, dass es sich um einen Slug handelt
          whereCondition = { slug: chapterId };
        }
      }

      const chapter = await this.chapterRepository.findOne({
        where: whereCondition,
        relations: ['topic', 'medias'],
      });

      if (!chapter) {
        throw new NotFoundException('Chapter not found');
      }

      const getChapterResponse = {
        id: chapter.id,
        position: chapter.position,
        name: chapter.name,
        slug: chapter.slug,
        imageId: chapter.imageId,
        topic: chapter.topic,
        topicId: chapter.topicId,
        medias: chapter.medias,
      } as GetTutorialChapterResponse;

      /* this.logger.log(
        `Successfully executed GetTutorialChapterQuery: ${JSON.stringify(
          getChapterResponse,
        )}`,
      ); */

      return getChapterResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
