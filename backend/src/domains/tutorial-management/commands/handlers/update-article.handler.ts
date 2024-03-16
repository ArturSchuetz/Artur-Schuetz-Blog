import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { HelperService } from 'src/application/services/helper.service';

import { UpdateTutorialArticleCommand } from '../update-article.command';
import { TutorialArticleUpdatedEvent } from '../../events/article-updated.event';
import { TutorialArticle } from 'src/infrastructure/models/tutorial-article.entity';
import { UpdateTutorialArticleResponse } from '../../data-transfer-objects/update-article-response.dto';
import { TutorialArticleAggregate } from '../../aggregates/tutorial-article.aggregate';

@CommandHandler(UpdateTutorialArticleCommand)
export class UpdateTutorialArticleCommandHandler
  implements ICommandHandler<UpdateTutorialArticleCommand>
{
  private readonly logger = new Logger(UpdateTutorialArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(TutorialArticle)
    private readonly articleRepository: Repository<TutorialArticle>,
  ) {}

  async execute(command: UpdateTutorialArticleCommand): Promise<UpdateTutorialArticleResponse> {
    const { updateArticleRequest } = command;
    const {
      id,
      position,
      title,
      shortTitle,
      text,
      previewHostedVideoUrl,
      previewMediaId,
      previewText,
      tags,
      chapterId,
      useMathJax,
      isPublished,
      releasedAt,
      updatedAt,
      views,
    } = updateArticleRequest;

    const existingArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ['medias'],
    });

    if (!existingArticle) {
      throw new Error('Projekt nicht gefunden');
    }

    const article = await TutorialArticleAggregate.create(
      existingArticle.id,
      position,
      title,
      !isPublished ? this.helperService.createSlug(title) : existingArticle.slug,
      shortTitle,
      previewHostedVideoUrl,
      typeof previewMediaId === 'number' && !isNaN(previewMediaId)
        ? previewMediaId
        : null,
      previewText,
      tags,
      text,
      typeof chapterId === 'number' && !isNaN(chapterId) ? chapterId : null,
      useMathJax,
      isPublished,
      releasedAt,
      existingArticle.authorId,
    );

    const updatedArticle = await this.articleRepository.save(article);

    const articleModel = this.eventPublisher.mergeObjectContext(updatedArticle);
    articleModel.apply(new TutorialArticleUpdatedEvent(id));
    articleModel.commit();

    const updateArticleResponse: UpdateTutorialArticleResponse = {
      id: updatedArticle.id,
      position: updatedArticle.position,
      title: updatedArticle.title,
      slug: updatedArticle.slug,
      shortTitle: updatedArticle.shortTitle,
      text: updatedArticle.text,
      previewHostedVideoUrl: updatedArticle.previewHostedVideoUrl,
      previewMediaId: updatedArticle.previewMediaId,
      previewText: updatedArticle.previewText,
      tags: updatedArticle.tags,
      chapterId: updatedArticle.chapterId,
      useMathJax: updatedArticle.useMathJax,
      isPublished: updatedArticle.isPublished,
      releasedAt: updatedArticle.releasedAt,
      updatedAt: updatedArticle.updatedAt,
      medias: existingArticle.medias,
    };

    /* this.logger.log(
      `Successfully executed UpdateTutorialArticleCommand: ${JSON.stringify(
        updateArticleResponse,
      )}`,
    ); */

    return updateArticleResponse;
  }
}
