import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublishBlogArticleCommand } from '../publish-article.command';
import { BlogArticle } from 'src/infrastructure/models/blog-article.entity';
import { BlogArticleAggregate } from '../../aggregates/blog-article.aggregate';
import { BlogArticleUpdatedEvent } from '../../events/article-updated.event';
import { UpdateBlogArticleResponse } from '../../data-transfer-objects/update-article-response.dto';
import { Logger } from '@nestjs/common';

@CommandHandler(PublishBlogArticleCommand)
export class PublishBlogArticleCommandHandler
  implements ICommandHandler<PublishBlogArticleCommand>
{
  private readonly logger = new Logger(PublishBlogArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(BlogArticle)
    private readonly articleRepository: Repository<BlogArticle>,
  ) {}

  async execute(
    command: PublishBlogArticleCommand,
  ): Promise<UpdateBlogArticleResponse> {
    const { publishArticleRequest } = command;
    const { id } = publishArticleRequest;

    const existingArticle = await this.articleRepository.findOne({
      where: { id },
      relations: ['medias'],
    });

    if (!existingArticle) {
      throw new Error('Projekt nicht gefunden');
    }

    const article = await BlogArticleAggregate.create(
      existingArticle.id,
      existingArticle.title,
      existingArticle.slug,
      existingArticle.text,
      existingArticle.titlePageImageId,
      existingArticle.previewHostedVideoUrl,
      existingArticle.previewMediaId,
      existingArticle.previewText,
      existingArticle.advertisement,
      existingArticle.tags,
      existingArticle.categoryId,
      existingArticle.previousArticleId,
      existingArticle.nextArticleId,
      existingArticle.useMathJax,
      true,
      new Date(),
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
      `Successfully executed PublishBlogArticleCommand: ${JSON.stringify(
        updateArticleResponse,
      )}`,
    ); */

    return updateArticleResponse;
  }
}
