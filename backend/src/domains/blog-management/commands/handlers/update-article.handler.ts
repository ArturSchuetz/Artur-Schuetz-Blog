import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBlogArticleCommand } from '../update-article.command';
import { BlogArticleUpdatedEvent } from '../../events/article-updated.event';
import { BlogArticle } from 'src/infrastructure/models/blog-article.entity';
import { UpdateBlogArticleResponse } from '../../data-transfer-objects/update-article-response.dto';
import { BlogArticleAggregate } from '../../aggregates/blog-article.aggregate';
import { Logger } from '@nestjs/common';
import { HelperService } from 'src/application/services/helper.service';

@CommandHandler(UpdateBlogArticleCommand)
export class UpdateBlogArticleCommandHandler
  implements ICommandHandler<UpdateBlogArticleCommand>
{
  private readonly logger = new Logger(UpdateBlogArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(BlogArticle)
    private readonly articleRepository: Repository<BlogArticle>,
  ) {}

  async execute(command: UpdateBlogArticleCommand): Promise<UpdateBlogArticleResponse> {
    const { updateArticleRequest } = command;
    const {
      id,
      title,
      text,
      titlePageImageId,
      previewHostedVideoUrl,
      previewMediaId,
      previewText,
      tags,
      advertisement,
      categoryId,
      previousArticleId,
      nextArticleId,
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

    const article = await BlogArticleAggregate.create(
      existingArticle.id,
      title,
      !isPublished ? this.helperService.createSlug(title) : existingArticle.slug,
      text,
      typeof titlePageImageId === 'number' && !isNaN(titlePageImageId)
        ? titlePageImageId
        : null,
      previewHostedVideoUrl,
      typeof previewMediaId === 'number' && !isNaN(previewMediaId)
        ? previewMediaId
        : null,
      previewText,
      advertisement,
      tags,
      typeof categoryId === 'number' && !isNaN(categoryId) ? categoryId : null,
      typeof previousArticleId === 'number' && !isNaN(previousArticleId)
        ? previousArticleId
        : null,
      typeof nextArticleId === 'number' && !isNaN(nextArticleId)
        ? nextArticleId
        : null,
      useMathJax,
      isPublished,
      releasedAt,
      existingArticle.authorId,
    );

    const updatedArticle = await this.articleRepository.save(article);

    const articleModel = this.eventPublisher.mergeObjectContext(updatedArticle);
    articleModel.apply(new BlogArticleUpdatedEvent(id));
    articleModel.commit();

    const updateArticleResponse: UpdateBlogArticleResponse = {
      id: updatedArticle.id,
      title: updatedArticle.title,
      slug: updatedArticle.slug,
      text: updatedArticle.text,
      titlePageImageId: updatedArticle.titlePageImageId,
      previewHostedVideoUrl: updatedArticle.previewHostedVideoUrl,
      previewMediaId: updatedArticle.previewMediaId,
      previewText: updatedArticle.previewText,
      tags: updatedArticle.tags,
      advertisement: updatedArticle.advertisement,
      categoryId: updatedArticle.categoryId,
      previousArticleId: updatedArticle.previousArticleId,
      nextArticleId: updatedArticle.nextArticleId,
      useMathJax: updatedArticle.useMathJax,
      isPublished: updatedArticle.isPublished,
      releasedAt: updatedArticle.releasedAt,
      updatedAt: updatedArticle.updatedAt,
      medias: existingArticle.medias,
    };

    /* this.logger.log(
      `Successfully executed UpdateBlogArticleCommand: ${JSON.stringify(
        updateArticleResponse,
      )}`,
    ); */

    return updateArticleResponse;
  }
}
