import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { HelperService } from 'src/application/services/helper.service';

import { CreateTutorialArticleCommand } from '../create-article.command';
import { TutorialArticleCreatedEvent } from '../../events/article-created.event';
import { TutorialArticle } from 'src/infrastructure/models/tutorial-article.entity';
import { TutorialArticleAggregate } from '../../aggregates/tutorial-article.aggregate';

@CommandHandler(CreateTutorialArticleCommand)
export class CreateTutorialArticleCommandHandler
  implements ICommandHandler<CreateTutorialArticleCommand>
{
  private readonly logger = new Logger(CreateTutorialArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(TutorialArticle)
    private readonly articleRepository: Repository<TutorialArticle>,
  ) {}

  async execute(command: CreateTutorialArticleCommand): Promise<TutorialArticle> {
    const { createTutorialArticleRequest } = command;
    const {
      position,
      title,
      shortTitle,
      previewHostedVideoUrl,
      previewMediaId,
      previewText,
      tags,
      text,
      chapterId,
      useMathJax,
      isPublished,
      releasedAt,
      updatedAt,
      views,
      authorId,
    } = createTutorialArticleRequest;

    const article = await TutorialArticleAggregate.create(
      0,
      position,
      title,
      this.helperService.createSlug(title),
      shortTitle,
      previewHostedVideoUrl,
      previewMediaId,
      previewText,
      tags,
      text,
      chapterId,
      useMathJax,
      isPublished,
      releasedAt,
      authorId,
    );

    const createdArticle = await this.articleRepository.save(article);
    const articleModel = this.eventPublisher.mergeObjectContext(createdArticle);
    articleModel.apply(new TutorialArticleCreatedEvent(article.getId()));
    articleModel.commit();

    /* this.logger.log(
      `Successfully executed CreateTutorialArticleCommand: ${JSON.stringify(
        articleModel,
      )}`,
    ); */

    return articleModel;
  }
}
