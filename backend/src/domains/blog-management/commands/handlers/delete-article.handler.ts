import { CommandHandler, EventPublisher, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteBlogArticleCommand } from '../delete-article.command';
import { BlogArticleDeletedEvent } from '../../events/article-deleted.event';
import { BlogArticle } from 'src/infrastructure/models/blog-article.entity';
import { BlogArticleAggregate } from '../../aggregates/blog-article.aggregate';
import { Logger } from '@nestjs/common';

@CommandHandler(DeleteBlogArticleCommand)
export class DeleteBlogArticleCommandHandler
  implements ICommandHandler<DeleteBlogArticleCommand>
{
  private readonly logger = new Logger(DeleteBlogArticleCommandHandler.name);

  constructor(
    private readonly eventPublisher: EventPublisher,
    @InjectRepository(BlogArticle)
    private readonly articleRepository: Repository<BlogArticle>,
  ) {}

  async execute(command: DeleteBlogArticleCommand): Promise<boolean> {
    const { deleteArticleRequest } = command;
    const { id } = deleteArticleRequest;

    const toDelete = await this.articleRepository.findOne({
      where: { id: id },
    });

    if (!toDelete) {
      return false;
    }

    const article = await BlogArticleAggregate.create(
      toDelete.id,
      toDelete.title,
      toDelete.slug,
      toDelete.text,
      toDelete.titlePageImageId,
      toDelete.previewHostedVideoUrl,
      toDelete.previewMediaId,
      toDelete.previewText,
      toDelete.advertisement,
      toDelete.tags,
      toDelete.categoryId,
      toDelete.previousArticleId,
      toDelete.nextArticleId,
      toDelete.useMathJax,
      toDelete.isPublished,
      toDelete.releasedAt,
      toDelete.authorId,
    );

    const deleteResult = await this.articleRepository.delete(article.id);
    const articleModel = this.eventPublisher.mergeObjectContext(article);
    if (deleteResult.affected.valueOf() > 0) {
      articleModel.apply(new BlogArticleDeletedEvent(articleModel.getId()));
    }
    articleModel.commit();

    /* this.logger.log(
      `Successfully executed DeleteBlogArticleCommand: ${JSON.stringify(
        deleteArticleRequest,
      )}`,
    ); */

    return true;
  }
}
