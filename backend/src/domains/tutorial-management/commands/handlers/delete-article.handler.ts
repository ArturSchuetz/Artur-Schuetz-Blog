import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { DeleteTutorialArticleCommand } from '../delete-article.command';
import { TutorialArticleDeletedEvent } from '../../events/article-deleted.event';
import { TutorialArticle } from 'src/infrastructure/models/tutorial-article.entity';
import { TutorialArticleAggregate } from '../../aggregates/tutorial-article.aggregate';

@CommandHandler(DeleteTutorialArticleCommand)
export class DeleteTutorialArticleCommandHandler
  implements ICommandHandler<DeleteTutorialArticleCommand>
{
  private readonly logger = new Logger(DeleteTutorialArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(TutorialArticle)
    private readonly articleRepository: Repository<TutorialArticle>,
  ) {}

  async execute(command: DeleteTutorialArticleCommand): Promise<boolean> {
    const { deleteTutorialArticleRequest } = command;
    const { id } = deleteTutorialArticleRequest;

    const toDelete = await this.articleRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      return false;
    }

    const article = await TutorialArticleAggregate.create(
      toDelete.id,
      toDelete.position,
      toDelete.title,
      toDelete.slug,
      toDelete.shortTitle,
      toDelete.previewHostedVideoUrl,
      toDelete.previewMediaId,
      toDelete.previewText,
      toDelete.tags,
      toDelete.text,
      toDelete.chapterId,
      toDelete.useMathJax,
      toDelete.isPublished,
      toDelete.releasedAt,
      toDelete.authorId,
    );

    const deleteResult = await this.articleRepository.delete(article.id);
    const articleModel = this.eventPublisher.mergeObjectContext(article);
    if (deleteResult.affected.valueOf() > 0) {
      articleModel.apply(new TutorialArticleDeletedEvent(articleModel.getId()));
    }
    articleModel.commit();

    /* this.logger.log(
      `Successfully executed DeleteTutorialArticleCommand: ${JSON.stringify(
        deleteArticleRequest,
      )}`,
    ); */

    return true;
  }
}
