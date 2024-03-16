import { Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetTutorialTopicQuery } from '../get-topic.query';
import { TutorialTopic } from 'src/infrastructure/models/tutorial-topic.entity';
import { GetTutorialTopicResponse } from '../../data-transfer-objects/get-topic-response.dto';

@QueryHandler(GetTutorialTopicQuery)
export class GetTutorialTopicHandler implements IQueryHandler<GetTutorialTopicQuery> {
  private readonly logger = new Logger(GetTutorialTopicHandler.name);

  constructor(
    @InjectRepository(TutorialTopic)
    private readonly topicRepository: Repository<TutorialTopic>,
  ) {}

  async execute(query: GetTutorialTopicQuery): Promise<GetTutorialTopicResponse> {
    /* this.logger.log(`Handling GetTutorialTopicQuery: ${JSON.stringify(query)}`); */

    const { topicId } = query;

    try {
      let whereCondition;
      if (typeof topicId === 'number') {
        // Wenn topicId ein number ist, suche nach ID
        whereCondition = { id: topicId };
      } else if (typeof topicId === 'string') {
        // Prüfe, ob die topicId vollständig numerisch ist
        if (/^\d+$/.test(topicId)) {
          // Wenn topicId eine Zeichenkette ist, die nur Zahlen enthält, behandele sie als numerische ID
          whereCondition = { id: parseInt(topicId, 10) };
        } else {
          // Ansonsten gehe davon aus, dass es sich um einen Slug handelt
          whereCondition = { slug: topicId };
        }
      }

      const topic = await this.topicRepository.findOne({
        where: whereCondition,
        relations: ['medias', 'chapters'],
      });

      if (!topic) {
        throw new NotFoundException('Topic not found');
      }

      const getTopicResponse = {
        id: topic.id,
        position: topic.position,
        name: topic.name,
        description: topic.description,
        slug: topic.slug,
        color: topic.color,
        imageId: topic.imageId,
        categoryId: topic.categoryId,
        medias: topic.medias,
        chapters: topic.chapters,
      } as GetTutorialTopicResponse;

      /* this.logger.log(
        `Successfully executed GetTutorialTopicQuery: ${JSON.stringify(
          getTopicResponse,
        )}`,
      ); */

      return getTopicResponse;
    } catch (error) {
      this.logger.error(`Database query failed: ${error.message}`);
      throw error;
    }
  }
}
