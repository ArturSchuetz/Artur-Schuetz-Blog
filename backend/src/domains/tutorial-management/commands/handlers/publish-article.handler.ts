import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { PublishTutorialArticleCommand } from '../publish-article.command';
import { TutorialArticle } from 'src/infrastructure/models/tutorial-article.entity';
import { TutorialArticleAggregate } from '../../aggregates/tutorial-article.aggregate';
import { TutorialArticleUpdatedEvent } from '../../events/article-updated.event';
import { UpdateTutorialArticleResponse } from '../../data-transfer-objects/update-article-response.dto';

@CommandHandler(PublishTutorialArticleCommand)
export class PublishTutorialArticleCommandHandler
  implements ICommandHandler<PublishTutorialArticleCommand>
{
  private readonly logger = new Logger(PublishTutorialArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(TutorialArticle)
    private readonly articleRepository: Repository<TutorialArticle>,
  ) {}

  async execute(
    command: PublishTutorialArticleCommand,
  ): Promise<UpdateTutorialArticleResponse> {
    const { publishTutorialArticleRequest } = command;
    const { id } = publishTutorialArticleRequest;

    const existingArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ['medias'],
    });

    if (!existingArticle) {
      throw new Error('Projekt nicht gefunden');
    }

    const article = await TutorialArticleAggregate.create(
      existingArticle.id,
      existingArticle.position,
      existingArticle.title,
      existingArticle.slug,
      existingArticle.shortTitle,
      existingArticle.previewHostedVideoUrl,
      existingArticle.previewMediaId,
      existingArticle.previewText,
      existingArticle.tags,
      existingArticle.text,
      existingArticle.chapterId,
      existingArticle.useMathJax,
      true,
      new Date(),
      existingArticle.authorId,
    );

    const updatedArticle = await this.articleRepository.save(article);

    const articleModel = this.eventPublisher.mergeObjectContext(updatedArticle);
    articleModel.apply(new TutorialArticleUpdatedEvent(id));
    articleModel.commit();

    const updateTutorialArticleResponse: UpdateTutorialArticleResponse = {
      id: updatedArticle.id,
      position: updatedArticle.position,
      title: updatedArticle.title,
      slug: updatedArticle.slug,
      shortTitle: updatedArticle.shortTitle,
      previewHostedVideoUrl: updatedArticle.previewHostedVideoUrl,
      previewMediaId: updatedArticle.previewMediaId,
      previewText: updatedArticle.previewText,
      tags: updatedArticle.tags,
      text: updatedArticle.text,
      chapterId: updatedArticle.chapterId,
      useMathJax: updatedArticle.useMathJax,
      isPublished: updatedArticle.isPublished,
      releasedAt: updatedArticle.releasedAt,
      updatedAt: updatedArticle.updatedAt,
      medias: existingArticle.medias,
    };

    /* this.logger.log(
      `Successfully executed PublishTutorialArticleCommand: ${JSON.stringify(
        updateArticleResponse,
      )}`,
    ); */

    return updateTutorialArticleResponse;
  }
}
