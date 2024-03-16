import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBlogArticleCommand } from '../create-article.command';
import { BlogArticleCreatedEvent } from '../../events/article-created.event';
import { BlogArticle } from 'src/infrastructure/models/blog-article.entity';
import { BlogArticleAggregate } from '../../aggregates/blog-article.aggregate';
import { Logger } from '@nestjs/common';
import { HelperService } from 'src/application/services/helper.service';

@CommandHandler(CreateBlogArticleCommand)
export class CreateBlogArticleCommandHandler
  implements ICommandHandler<CreateBlogArticleCommand>
{
  private readonly logger = new Logger(CreateBlogArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    private readonly helperService: HelperService,
    @InjectRepository(BlogArticle)
    private readonly articleRepository: Repository<BlogArticle>,
  ) {}

  async execute(command: CreateBlogArticleCommand): Promise<BlogArticle> {
    const { createArticleRequest } = command;
    const {
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
      authorId,
    } = createArticleRequest;

    const article = await BlogArticleAggregate.create(
      0,
      title,
      this.helperService.createSlug(title),
      text,
      titlePageImageId,
      previewHostedVideoUrl,
      previewMediaId,
      previewText,
      advertisement,
      tags,
      categoryId,
      previousArticleId,
      nextArticleId,
      useMathJax,
      isPublished,
      releasedAt,
      authorId,
    );

    const createdArticle = await this.articleRepository.save(article);
    const articleModel = this.eventPublisher.mergeObjectContext(createdArticle);
    articleModel.apply(new BlogArticleCreatedEvent(article.getId()));
    articleModel.commit();

    /* this.logger.log(
      `Successfully executed CreateBlogArticleCommand: ${JSON.stringify(
        articleModel,
      )}`,
    ); */

    return articleModel;
  }
}
